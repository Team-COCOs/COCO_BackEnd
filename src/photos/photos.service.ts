import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, MoreThan, In } from "typeorm";
import { Photo, VisibilityType } from "./photos.entity";
import { NewPhotoDto, SavePhotoDto } from "./dto/photos.dto";
import { PhotoFolder } from "./photoFolder.entity";
import { UsersService } from "../users/users.service";
import { SavePhotoFolderDto } from "./dto/photoFolder.dto";
import { FriendsService } from "src/friends/friends.service";

@Injectable()
export class PhotosService {
  constructor(
    @InjectRepository(Photo)
    private readonly photoRepository: Repository<Photo>,

    @InjectRepository(PhotoFolder)
    private readonly photoFolderRepository: Repository<PhotoFolder>,

    private readonly friendsService: FriendsService,

    @Inject(forwardRef(() => UsersService))
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
      relations: ["folder", "user"],
      order: { created_at: "DESC" },
      take: 10,
    });

    const mappedPhotos: NewPhotoDto[] = photos.map((p) => {
      const koreaTime = new Date(p.created_at.getTime() + 9 * 60 * 60 * 1000);
      return {
        id: p.id,
        author: p.user.name,
        folderName: p.folder?.title ?? "기타",
        photoUrl: p.photo_url,
        title: p.title,
        content: p.content,
        created_at: koreaTime.toISOString().replace("T", " ").substring(0, 16),
        type: "photo",
      };
    });

    return mappedPhotos;
  }

  async saveFolderTree(folders: SavePhotoFolderDto[], userId: number) {
    const user = await this.usersService.findUserById(userId);

    if (!user) throw new Error("유저 정보가 없습니다");

    // 기존 폴더들 불러오기
    const existingFolders = await this.photoFolderRepository.find({
      where: { user },
      relations: ["parent"],
    });

    // 기존 폴더 매핑 (기존 폴더 제목을 키로 사용)
    const existingMap = new Map<number, PhotoFolder>();
    for (const folder of existingFolders) {
      existingMap.set(folder.id, folder);
    }

    // 새로운 폴더 추가 및 기존 폴더 업데이트
    const keyToEntityMap = new Map<string, PhotoFolder>();

    for (const dto of folders) {
      let folder: PhotoFolder;

      // 기존 폴더가 있는지 확인하고, 없으면 새로 생성
      if (existingMap.has(dto.id)) {
        folder = existingMap.get(dto.id)!;
        folder.title = dto.title; // 폴더 제목 업데이트
        folder.user = user;

        // 부모 폴더 매핑 및 변경 사항이 있으면 업데이트
        if (dto.parent_id && keyToEntityMap.has(dto.parent_id)) {
          const newParentFolder = keyToEntityMap.get(dto.parent_id)!;
          if (folder.parent?.id !== newParentFolder.id) {
            folder.parent = newParentFolder;
            await this.photoFolderRepository.save(folder); // 부모 폴더 변경 시 업데이트
          }
        }
      } else {
        // 새로운 폴더인 경우 새로 저장
        folder = new PhotoFolder();
        folder.title = dto.title;
        folder.user = user;

        // 부모 폴더 매핑
        if (dto.parent_id && keyToEntityMap.has(dto.parent_id)) {
          folder.parent = keyToEntityMap.get(dto.parent_id)!;
        }

        // 폴더 저장
        const savedFolder = await this.photoFolderRepository.save(folder);
        keyToEntityMap.set(dto.key, savedFolder);
      }
    }

    // 선택된 폴더 삭제 (기존 폴더 중 선택되지 않은 것만 삭제)
    const titlesToKeep = new Set(folders.map((f) => f.title));
    const toDelete = existingFolders.filter((f) => !titlesToKeep.has(f.title));
    await this.photoFolderRepository.remove(toDelete);

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

  // 사진첩 게시글 저장
  async savePhoto(userId: number, dto: SavePhotoDto): Promise<Photo> {
    const user = await this.usersService.findUserById(userId);
    if (!user) throw new Error("User not found");

    const photo = new Photo();
    photo.user = user;
    photo.photo_url = dto.photo_url;
    photo.title = dto.title;
    photo.content = dto.content;
    photo.visibility = dto.visibility;
    photo.isScripted = dto.isScripted;

    if (dto.folderId) {
      const folder = await this.photoFolderRepository.findOne({
        where: { id: dto.folderId },
      });
      if (!folder) throw new Error("Folder not found");
      photo.folder = folder;
    }

    return await this.photoRepository.save(photo);
  }

  // 사진첩 게시글 조회
  async getPhotosByUser(hostId: number, viewId: number): Promise<Photo[]> {
    const targetUser = await this.usersService.findUserById(hostId);
    if (!targetUser) throw new Error("Target user not found");

    const visibilityFilters: VisibilityType[] = [VisibilityType.PUBLIC];

    if (hostId === viewId) {
      // 내 프로필 → 모든 사진 조회
      visibilityFilters.push(
        VisibilityType.PRIVATE,
        VisibilityType.FRIENDS_ONLY
      );
    } else {
      // 다른 사람 → 일촌인지 확인
      const friendStatus = await this.friendsService.friendStatus(
        hostId,
        viewId
      );
      if (friendStatus.areFriends) {
        visibilityFilters.push(VisibilityType.FRIENDS_ONLY);
      }
      // 비일촌이거나 비로그인 사용자는 PUBLIC만 유지
    }

    return await this.photoRepository.find({
      where: {
        user: { id: hostId },
        visibility: In(visibilityFilters),
      },
      relations: [
        "user",
        "folder",
        "comments",
        "comments.user",
        "comments.parentComment",
      ],
      order: { created_at: "DESC" },
    });
  }

  // 로그아웃 유저가 조회할때
  async getPhotosByLogout(hostId: number): Promise<Photo[]> {
    const targetUser = await this.usersService.findUserById(hostId);
    if (!targetUser) throw new Error("Target user not found");

    const visibilityFilters: VisibilityType[] = [VisibilityType.PUBLIC];

    return await this.photoRepository.find({
      where: {
        user: { id: hostId },
        visibility: In(visibilityFilters),
      },
      relations: [
        "user",
        "folder",
        "comments",
        "comments.user",
        "comments.parentComment",
      ],
      order: { created_at: "DESC" },
    });
  }

  // 사진첩 스크랩
  async clipPhoto(userId: number, photoId: number): Promise<Photo> {
    const originalPhoto = await this.photoRepository.findOne({
      where: { id: photoId },
      relations: ["folder", "user"],
    });

    if (!originalPhoto) {
      throw new Error("원본 사진을 찾을 수 없습니다.");
    }

    const user = await this.usersService.findUserById(userId);
    if (!user) throw new Error("사용자를 찾을 수 없습니다.");

    // 스크랩 폴더 확인 또는 생성
    let scrapFolder = await this.photoFolderRepository.findOne({
      where: {
        user: { id: userId },
        title: "스크랩",
      },
    });

    if (!scrapFolder) {
      scrapFolder = this.photoFolderRepository.create({
        title: "스크랩",
        user,
      });
      scrapFolder = await this.photoFolderRepository.save(scrapFolder);
    }

    const copiedPhoto = new Photo();
    copiedPhoto.title = originalPhoto.title;
    copiedPhoto.content = originalPhoto.content;
    copiedPhoto.photo_url = originalPhoto.photo_url;
    copiedPhoto.visibility = VisibilityType.PUBLIC;
    copiedPhoto.folder = scrapFolder;
    copiedPhoto.isScripted = true;
    copiedPhoto.user = user;
    copiedPhoto.origin_author =
      originalPhoto.origin_author || originalPhoto.user.name;

    originalPhoto.use_count = (originalPhoto.use_count || 0) + 1;
    await this.photoRepository.save(originalPhoto);

    return await this.photoRepository.save(copiedPhoto);
  }
}
