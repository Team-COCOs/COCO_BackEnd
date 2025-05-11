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
      message: "폴더 트리 저장 완료",
      folders: Array.from(keyToEntityMap.values()).map((f) => ({
        id: f.id,
        title: f.title,
        parent_id: f.parent?.id ?? null,
      })),
    };
  }
}
