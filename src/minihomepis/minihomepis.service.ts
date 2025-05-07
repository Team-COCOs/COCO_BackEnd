import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Minihomepi } from "./minihomepis.entity";

@Injectable()
export class MinihomepisService {
  constructor(
    @InjectRepository(Minihomepi)
    private readonly miniRepository: Repository<Minihomepi>
  ) {}

  // minihomepi 조회
  async getMinihomepiByUserId(userId: number): Promise<Minihomepi> {
    const mini = await this.miniRepository.findOne({
      where: { user: { id: userId } },
    });
    if (!mini) throw new NotFoundException("Minihomepi를 찾을 수 없습니다.");
    return mini;
  }

  // 총 방문자 수 업데이트
  async setTotalVisitCount(userId: number, count: number): Promise<void> {
    await this.miniRepository.update(
      { user: { id: userId } },
      { visit_count: count }
    );
  }

  // 총 방문자 수 조회
  async getVisitCount(userId: number): Promise<number> {
    const mini = await this.getMinihomepiByUserId(userId);
    return mini.visit_count;
  }

  // 제목 수정
  async updateTitle(userId: number, title: string): Promise<void> {
    await this.miniRepository.update({ user: { id: userId } }, { title });
  }

  // 무드 수정
  async updateMood(userId: number, mood: string): Promise<void> {
    await this.miniRepository.update({ user: { id: userId } }, { mood });
  }
}
