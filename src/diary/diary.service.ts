import { Injectable } from "@nestjs/common";
import { Diary } from "./diary.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { MoreThan, Repository } from "typeorm";
import { NewDiaryDto } from "./dto/diary.dto";
import { DiaryFolder } from "./diaryFolder.entity";
import { UsersService } from "src/users/users.service";
import { SaveDiaryFolderDto } from "./dto/diaryFolder.dto";

@Injectable()
export class DiaryService {
  constructor(
    @InjectRepository(Diary)
    private readonly diaryRepository: Repository<Diary>,

    @InjectRepository(DiaryFolder)
    private readonly diaryFolderRepository: Repository<DiaryFolder>,

    private readonly usersService: UsersService
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
      title: d.title,
      content: d.content,
      created_at: d.created_at.toISOString().slice(0, 16).replace("T", " "),
      type: "diary" as const,
    }));

    return mappedDiaries;
  }

  // 다이어리 폴더 저장
  async saveFolderTree(folders: SaveDiaryFolderDto[], userId: number) {
    const user = await this.usersService.findUserById(userId);

    if (!user) throw new Error("User not found");

    await this.diaryFolderRepository.delete({ user });

    const keyToEntityMap = new Map<string, DiaryFolder>();

    for (const dto of folders) {
      const folder = new DiaryFolder();
      folder.title = dto.title;
      folder.user = user;

      if (dto.parent_id && keyToEntityMap.has(dto.parent_id)) {
        folder.parent = keyToEntityMap.get(dto.parent_id)!;
      }

      const saved = await this.diaryFolderRepository.save(folder);
      keyToEntityMap.set(dto.key, saved);
    }

    return {
      message: "폴더 저장 완료",
    };
  }

  // 폴더 조회
  async getFolder(userId: number): Promise<DiaryFolder[]> {
    const user = await this.usersService.findUserById(userId);

    if (!user) throw new Error("User not found");

    const folders = await this.diaryFolderRepository.find({
      where: { user: { id: userId } },
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
}
