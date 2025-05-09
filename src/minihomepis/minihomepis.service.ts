import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Minihomepi } from "./minihomepis.entity";
import { UsersService } from "src/users/users.service";

@Injectable()
export class MinihomepisService {
  constructor(
    @InjectRepository(Minihomepi)
    private readonly miniRepository: Repository<Minihomepi>
  ) {}

  // 총 방문자 수 업데이트
  async setTotalVisitCount(userId: number, count: number): Promise<void> {
    await this.miniRepository.update(
      { user: { id: userId } },
      { visit_count: count }
    );
  }

  // 총 방문자 수 조회
  async getVisitCount(userId: number): Promise<number> {
    const mini = await this.miniRepository.findOne({
      where: { user: { id: userId } },
    });

    if (!mini) throw new NotFoundException("미니홈피가 존재하지 않습니다.");

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

  // 화재의 미니홈피
  async getTop5HotMinihomepis() {
    const top = await this.miniRepository.find({
      relations: ["user"],
      order: { visit_count: "DESC" },
      take: 5,
    });

    return top.map((m) => ({
      userId: m.user.id,
      name: m.user.name,
      visit_count: m.visit_count,
    }));
  }
}
