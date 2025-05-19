import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from "@nestjs/common";
import { Diary, VisibilityType } from "./diary.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { In, MoreThan, Repository } from "typeorm";
import { NewDiaryDto, SaveDiaryDto } from "./dto/diary.dto";
import { DiaryFolder } from "./diaryFolder.entity";
import { UsersService } from "src/users/users.service";
import { SaveDiaryFolderDto } from "./dto/diaryFolder.dto";
import { FriendsService } from "src/friends/friends.service";

@Injectable()
export class DiaryService {
  constructor(
    @InjectRepository(Diary)
    private readonly diaryRepository: Repository<Diary>,

    @InjectRepository(DiaryFolder)
    private readonly diaryFolderRepository: Repository<DiaryFolder>,

    private readonly usersService: UsersService,
    private readonly friendsService: FriendsService
  ) {}

  // 오늘 새 게시물
  async getNewDiarys(userId: number): Promise<NewDiaryDto[]> {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const diaries = await this.diaryRepository.find({
      where: {
        user: { id: userId },
        created_at: MoreThan(todayStart),
      },
      order: { created_at: "DESC" },
      take: 10,
    });

    const mappedDiaries = diaries.map((d) => ({
      id: d.id,
      content: d.content,
      mood: d.mood,
      weather: d.weather,
      created_at: d.created_at.toISOString().slice(0, 16).replace("T", " "),
      type: "diary" as const,
    }));

    return mappedDiaries;
  }

  // 다이어리 폴더 저장
  async saveFolderTree(folders: SaveDiaryFolderDto[], userId: number) {
    const user = await this.usersService.findUserById(userId);

    if (!user) {
      throw new NotFoundException("일치하는 회원 정보가 없습니다.");
    }

    // 새 폴더를 위한 매핑
    const keyToEntityMap = new Map<string, DiaryFolder>();

    const existingFolders = await this.diaryFolderRepository.find({
      where: { user: { id: userId } },
      relations: ["parent"],
      withDeleted: true,
    });

    const existingFolderMap = new Map<number, DiaryFolder>();

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
      await this.diaryFolderRepository.save(folder);
    }

    // 생성 및 업데이트 처리
    for (const dto of folders) {
      const maybeId = Number(dto.key);
      const isExisting = !isNaN(maybeId);

      let folder: DiaryFolder;

      if (isExisting && existingFolderMap.has(maybeId)) {
        // 기존 폴더 업데이트
        folder = existingFolderMap.get(maybeId)!;
        folder.title = dto.title;
        folder.is_deleted = false; // soft-delete 되었던 폴더 복구
      } else {
        // 중복 제목 검사 (삭제된 것 제외)
        const duplicate = await this.diaryFolderRepository.findOne({
          where: {
            user: { id: userId },
            title: dto.title,
            is_deleted: false,
          },
        });
        if (duplicate) {
          throw new NotFoundException(`폴더명이 중복되었습니다: ${dto.title}`);
        }

        // 새 폴더 생성
        folder = new DiaryFolder();
        folder.title = dto.title;
        folder.user = user;
      }

      // 부모 연결
      if (dto.parent_id && keyToEntityMap.has(dto.parent_id)) {
        folder.parent = keyToEntityMap.get(dto.parent_id)!;
      } else {
        folder.parent = null;
      }

      await this.diaryFolderRepository.save(folder);
      keyToEntityMap.set(dto.key, folder);
    }

    return { message: "폴더 트리 저장 완료" };
  }

  // 폴더 조회
  async getFolder(userId: number): Promise<DiaryFolder[]> {
    const user = await this.usersService.findUserById(userId);

    if (!user) throw new NotFoundException("User not found");

    const folders = await this.diaryFolderRepository.find({
      where: { user: { id: userId }, is_deleted: false },
      relations: ["parent"],
      // 부모 폴더 관계 포함
    });

    // 트리로 변환
    return this.buildTree(folders);
  }

  // 폴더 트리 구조를 빌드
  private buildTree(data: DiaryFolder[]): DiaryFolder[] {
    const idMap = new Map<number, DiaryFolder>();
    const tree: DiaryFolder[] = [];

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

  // 다이어리 게시글 저장
  async saveDiary(userId: number, dto: SaveDiaryDto): Promise<Diary> {
    const user = await this.usersService.findUserById(userId);
    if (!user) throw new NotFoundException("유저 정보가 없습니다");

    const diary = new Diary();
    diary.user = user;
    diary.content = dto.content;
    diary.visibility = dto.visibility;
    diary.mood = dto.mood;
    diary.weather = dto.weather;

    if (dto.folder_name) {
      const folder = await this.diaryFolderRepository.findOne({
        where: {
          user: { id: userId },
          title: dto.folder_name,
        },
        relations: ["user"],
      });
      if (!folder) throw new NotFoundException("폴더 정보가 없습니다.");

      diary.folder = folder;
    }

    return await this.diaryRepository.save(diary);
  }

  // 다이어리 게시글 조회
  async getPhotosByUser(hostId: number, viewId: number): Promise<Diary[]> {
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

    return await this.diaryRepository.find({
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
  async getDiaryByLogout(hostId: number): Promise<Diary[]> {
    const targetUser = await this.usersService.findUserById(hostId);
    if (!targetUser) throw new NotFoundException("Target user not found");

    const visibilityFilters: VisibilityType[] = [VisibilityType.PUBLIC];

    return await this.diaryRepository.find({
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

  // 다이어리 삭제
  async deletePost(userId: number, diaryId: number): Promise<{ ok: boolean }> {
    const post = await this.diaryRepository.findOne({
      where: { id: diaryId },
      relations: ["user"],
    });

    if (!post) {
      throw new NotFoundException("게시글을 찾을 수 없습니다.");
    }

    const author = post.user.id === userId;

    if (!author) {
      throw new NotFoundException("삭제 권한이 없습니다.");
    }

    await this.diaryRepository.remove(post);

    return { ok: true };
  }
}
