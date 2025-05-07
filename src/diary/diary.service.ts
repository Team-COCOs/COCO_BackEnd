import { Injectable } from "@nestjs/common";
import { Diary } from "./diary.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { MoreThan, Repository } from "typeorm";
import { NewDiaryDto } from "./dto/diary.dto";

@Injectable()
export class DiaryService {
  constructor(
    @InjectRepository(Diary)
    private readonly diaryRepository: Repository<Diary>
  ) {}

  async getNewDiarys(userId: number): Promise<NewDiaryDto[]> {
    // “오늘” 00:00 기준
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    //오늘 내가 쓴 다이어리
    const diaries = await this.diaryRepository.find({
      where: {
        user: { id: userId },
        created_at: MoreThan(todayStart),
      },
      order: { created_at: "DESC" },
      take: 10,
    });

    // ── 4) DTO 매핑
    const mappedDiaries = diaries.map((d) => ({
      id: d.id,
      title: d.title,
      content: d.content,
      createdAt: d.created_at.toISOString().slice(0, 16).replace("T", " "),
      type: "diary" as const,
    }));

    // ── 5) 합쳐서 최신순 정렬
    return mappedDiaries;
  }
}
