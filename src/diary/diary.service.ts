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
      createdAt: d.created_at.toISOString().slice(0, 16).replace("T", " "),
      type: "diary" as const,
    }));

    return mappedDiaries;
  }
}
