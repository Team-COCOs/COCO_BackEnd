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

  // 사진첩 폴더 저장
  async saveFolderTree(folders: SavePhotoFolderDto[], userId: number) {
    const user = await this.usersService.findUserById(userId);
    if (!user) throw new NotFoundException("유저 정보가 없습니다");

    // 새 폴더를 위한 매핑
    const keyToEntityMap = new Map<string, PhotoFolder>();

    // 기존 폴더 모두 로드 (삭제된 것도 포함해야 업데이트 및 복구 가능)
    const existingFolders = await this.photoFolderRepository.find({
      where: { user: { id: userId } },
      relations: ["parent"],
      withDeleted: true,
    });

    const existingFolderMap = new Map<number, PhotoFolder>();

    for (const folder of existingFolders) {
      existingFolderMap.set(folder.id, folder);
    }

    // 이번 요청에서 받은 폴더 key들
    const receivedKeys = new Set(folders.map((f) => f.key));

    // 이미 있는 폴더 중, 요청에 없는 것들 → soft-delete 처리 (is_deleted : true)
    const toDisable = existingFolders.filter(
      (f) => !receivedKeys.has(f.id.toString()) && !f.is_deleted
    );
    for (const folder of toDisable) {
      folder.is_deleted = true;
      await this.photoFolderRepository.save(folder);
    }

    // 생성 및 업데이트 처리
    for (const dto of folders) {
      const maybeId = Number(dto.key);
      const isExisting = !isNaN(maybeId);

      let folder: PhotoFolder;

      if (isExisting && existingFolderMap.has(maybeId)) {
        // 기존 폴더 업데이트
        folder = existingFolderMap.get(maybeId)!;
        folder.title = dto.title;
        folder.is_deleted = false; // soft-delete 되었던 폴더 복구
      } else {
        // 중복 제목 검사 (삭제된 것 제외)
        const duplicate = await this.photoFolderRepository.findOne({
          where: {
            user: { id: userId },
            title: dto.title,
            is_deleted: false,
          },
        });

        if (duplicate) {
          return {
            success: false,
            message: `폴더명이 중복되었습니다: ${dto.title}`,
            duplicatedTitle: dto.title,
          };
        }

        // 새 폴더 생성
        folder = new PhotoFolder();
        folder.title = dto.title;
        folder.user = user;
      }

      // 부모 연결
      if (dto.parent_id && keyToEntityMap.has(dto.parent_id)) {
        folder.parent = keyToEntityMap.get(dto.parent_id)!;
      } else {
        folder.parent = null;
      }

      await this.photoFolderRepository.save(folder);
      keyToEntityMap.set(dto.key, folder);
    }

    return { message: "폴더 트리 저장 완료" };
  }

  // 폴더 조회
  async getFolder(userId: number): Promise<PhotoFolder[]> {
    const user = await this.usersService.findUserById(userId);

    if (!user) throw new NotFoundException("User not found");

    const folders = await this.photoFolderRepository.find({
      where: { user: { id: userId }, is_deleted: false },
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

  // 회원가입 -> 새폴더 생성
  async createDefaultFolders(userId: number): Promise<void> {
    const user = await this.usersService.findUserById(userId);
    if (!user) throw new Error("유저 정보가 없습니다");

    const existing = await this.photoFolderRepository.find({ where: { user } });
    if (existing.length > 0) return;

    const defaultFolders = ["새 폴더", "스크랩"];
    for (const title of defaultFolders) {
      const folder = new PhotoFolder();
      folder.title = title;
      folder.user = user;
      await this.photoFolderRepository.save(folder);
    }
  }

  // 사진첩 게시글 저장
  async savePhoto(userId: number, dto: SavePhotoDto): Promise<Photo> {
    const user = await this.usersService.findUserById(userId);
    if (!user) throw new NotFoundException("유저 정보가 없습니다");

    const photo = new Photo();
    photo.user = user;
    photo.photo_url = dto.photo_url;
    photo.title = dto.title;
    photo.content = dto.content;
    photo.visibility = dto.visibility;
    photo.isScripted = dto.isScripted;

    if (dto.folder_name) {
      const folder = await this.photoFolderRepository.findOne({
        where: {
          user: { id: userId },
          title: dto.folder_name,
          is_deleted: false,
        },
        relations: ["user"],
      });
      if (!folder) throw new NotFoundException("폴더 정보가 없습니다.");
      photo.folder = folder;
    }

    return await this.photoRepository.save(photo);
  }

  // 사진첩 게시글 수정
  async updatePhoto(
    userId: number,
    photoId: number,
    dto: SavePhotoDto
  ): Promise<Photo> {
    const photo = await this.photoRepository.findOne({
      where: { id: photoId },
      relations: ["user", "folder"],
    });

    if (!photo) {
      throw new NotFoundException("게시글을 찾을 수 없습니다.");
    }

    if (photo.user.id !== userId) {
      throw new NotFoundException("수정 권한이 없습니다.");
    }

    photo.photo_url = dto.photo_url;
    photo.title = dto.title;
    photo.content = dto.content;
    photo.visibility = dto.visibility;
    photo.isScripted = dto.isScripted;

    if (dto.folder_name) {
      const folder = await this.photoFolderRepository.findOne({
        where: {
          user: { id: userId },
          title: dto.folder_name,
          is_deleted: false,
        },
        relations: ["user"],
      });

      if (!folder) throw new NotFoundException("폴더 정보가 없습니다.");
      photo.folder = folder;
    }

    return await this.photoRepository.save(photo);
  }

  // 사진첩 게시글 조회
  async getPhotosByUser(hostId: number, viewId: number): Promise<Photo[]> {
    const targetUser = await this.usersService.findUserById(hostId);
    if (!targetUser) throw new NotFoundException("해당 유저를 찾을수없습니다");

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
        "origin_author",
      ],
      order: { created_at: "DESC" },
    });
  }

  // 로그아웃 유저가 조회할때
  async getPhotosByLogout(hostId: number): Promise<Photo[]> {
    const targetUser = await this.usersService.findUserById(hostId);
    if (!targetUser) throw new NotFoundException("Target user not found");

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
        "origin_author",
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
      throw new NotFoundException("원본 사진을 찾을 수 없습니다.");
    }

    const user = await this.usersService.findUserById(userId);
    if (!user) throw new NotFoundException("사용자를 찾을 수 없습니다.");

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
    copiedPhoto.origin_author = originalPhoto.user;

    originalPhoto.use_count = (originalPhoto.use_count || 0) + 1;
    await this.photoRepository.save(originalPhoto);

    return await this.photoRepository.save(copiedPhoto);
  }

  // 사진첩 삭제
  async deletePost(userId: number, postId: number): Promise<{ ok: boolean }> {
    const post = await this.photoRepository.findOne({
      where: { id: postId },
      relations: ["user"],
    });

    if (!post) {
      throw new NotFoundException("게시글을 찾을 수 없습니다.");
    }

    const author = post.user.id === userId;

    if (!author) {
      throw new NotFoundException("삭제 권한이 없습니다.");
    }

    await this.photoRepository.remove(post);

    return { ok: true };
  }

  // 오늘 새로 올린 게시글 개수
  async getTodayPhotoCount(userId: number): Promise<number> {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    return await this.photoRepository.count({
      where: {
        user: { id: userId },
        created_at: MoreThan(todayStart),
      },
    });
  }

  // 총 게시글 개수
  async getTotalPhotoCount(userId: number): Promise<number> {
    return await this.photoRepository.count({
      where: { user: { id: userId } },
    });
  }

  // 최근 업로드한 게시글 제목 2개
  async getRecentPhotoTitles(userId: number): Promise<string[]> {
    const rows = await this.photoRepository
      .createQueryBuilder("photo")
      .select("photo.title", "title")
      .where("photo.user_id = :userId", { userId })
      .andWhere("photo.visibility = :visibility", { visibility: "public" })
      .orderBy("photo.created_at", "DESC")
      .limit(2)
      .limit(2)
      .getRawMany();

    return rows.map((row) => row.title);
  }
}
