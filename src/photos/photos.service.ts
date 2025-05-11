import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, MoreThan } from "typeorm";
import { Photo } from "./photos.entity";
import { NewPhotoDto } from "./dto/photos.dto";
import { PhotoFolder } from "./photoFolder.entity";
import { UsersService } from "../users/users.service";
import { SavePhotoFolderDto } from "./dto/photoFolder.dto";

@Injectable()
export class PhotosService {
  constructor(
    @InjectRepository(Photo)
    private readonly photoRepository: Repository<Photo>,

    @InjectRepository(PhotoFolder)
    private readonly photoFolderRepository: Repository<PhotoFolder>,

    private readonly usersService: UsersService
  ) {}

  // 오늘 새로 올린 사진
  async getNewPhotos(userId: number): Promise<NewPhotoDto[]> {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const photos = await this.photoRepository.find({
      where: {
        user: { id: userId },
        created_at: MoreThan(todayStart),
      },
      relations: ["folder"],
      order: { created_at: "DESC" },
      take: 10,
    });

    const mappedPhotos: NewPhotoDto[] = photos.map((p) => ({
      id: p.id,
      folderName: p.folder?.title ?? "기타",
      photoUrl: p.photo_url,
      title: p.title,
      content: p.content,
      created_at: p.created_at.toISOString().replace("T", " ").substring(0, 16),
      type: "photo",
    }));
    return mappedPhotos;
  }

  // 사진쳡 폴더 저장 및 조회
  async saveFolderTree(folders: SavePhotoFolderDto[], userId: number) {
    const user = await this.usersService.findUserById(userId);

    if (!user) throw new Error("User not found");

    await this.photoFolderRepository.delete({ user });

    const keyToEntityMap = new Map<string, PhotoFolder>();

    for (const dto of folders) {
      const folder = new PhotoFolder();
      folder.title = dto.title;
      folder.user = user;

      if (dto.parent_id && keyToEntityMap.has(dto.parent_id)) {
        folder.parent = keyToEntityMap.get(dto.parent_id)!;
      }

      const saved = await this.photoFolderRepository.save(folder);
      keyToEntityMap.set(dto.key, saved);
    }

    return {
      message: "폴더 저장 완료",
    };
  }

  // 폴더 조회
  async getFolder(userId: number): Promise<PhotoFolder[]> {
    const user = await this.usersService.findUserById(userId);

    if (!user) throw new Error("User not found");

    const folders = await this.photoFolderRepository.find({
      where: { user: { id: userId } },
      relations: ["parent"],
      // 부모 폴더 관계 포함
    });

    // 트리로 변환
    return this.buildTree(folders);
  }

  // 폴더 트리 구조를 빌드
  private buildTree(data: PhotoFolder[]): PhotoFolder[] {
    const idMap = new Map<number, PhotoFolder>();
    const tree: PhotoFolder[] = [];

    // 모든 폴더를 id로 매핑하여 자식 폴더를 저장할 수 있게 함
    data.forEach((item) => {
      idMap.set(item.id, { ...item, children: [] });
    });

    // 자식 폴더들을 부모 폴더에 추가
    data.forEach((item) => {
      const current = idMap.get(item.id)!;
      if (item.parent !== null) {
        const parent = idMap.get(item.parent.id);
        if (parent) {
          parent.children?.push(current);
        }
      } else {
        tree.push(current); // 루트 폴더는 트리에 추가
      }
    });

    return tree;
  }
}
