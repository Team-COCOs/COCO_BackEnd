import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Minihomepi } from "./minihomepis.entity";
import { UsersService } from "src/users/users.service";
import { MinihomepiStatusDto, UpdateMinihomepiDto } from "./dto/updateInfo.dto";

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

  // 미니홈피 정보 저장
  async updateMinihomepiStatus(
    userId: number,
    dto: UpdateMinihomepiDto
  ): Promise<void> {
    const { mood, title, introduction, minihompi_image } = dto;

    const mini = await this.miniRepository.findOne({
      where: { user: { id: userId } },
      relations: ["user"],
    });

    if (!mini) throw new Error("미니홈피가 존재하지 않습니다.");

    if (mood !== undefined) mini.mood = mood;
    if (title !== undefined) mini.title = title;
    if (introduction !== undefined) mini.introduction = introduction;
    if (minihompi_image !== undefined) mini.minihompi_image = minihompi_image;

    await this.miniRepository.save(mini);
  }

  // 미니홈피 정보 조회
  async getMinihomepiStatus(userId: number): Promise<MinihomepiStatusDto> {
    const mini = await this.miniRepository.findOne({
      where: { user: { id: userId } },
    });

    if (!mini) throw new Error("미니홈피가 존재하지 않습니다.");

    return {
      title: mini.title,
      mood: mini.mood,
      introduction: mini.introduction,
      minihompi_image: mini.minihompi_image,
    };
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
