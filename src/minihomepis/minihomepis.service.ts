import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Minihomepi } from "./minihomepis.entity";
import { UsersService } from "src/users/users.service";
import {
  MinihomepiStatusDto,
  MinihomepiInfoDto,
} from "./dto/minihomepiInfo.dto";

@Injectable()
export class MinihomepisService {
  constructor(
    @InjectRepository(Minihomepi)
    private readonly miniRepository: Repository<Minihomepi>,

    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService
  ) {}

  // 미니홈피 생성
  async saveMinihomepi(userId: number): Promise<Minihomepi> {
    const user = await this.usersService.findUserById(userId);
    if (!user) {
      throw new NotFoundException("유저를 찾을 수 없습니다.");
    }

    const minihomepi = this.miniRepository.create({
      user,
    });

    return await this.miniRepository.save(minihomepi);
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
    const mini = await this.miniRepository.findOne({
      where: { user: { id: userId } },
    });

    if (!mini) throw new NotFoundException("미니홈피가 존재하지 않습니다.");

    return mini.visit_count;
  }

  // 미니홈피 정보 저장
  async saveMinihomepiInfo(
    userId: number,
    dto: MinihomepiInfoDto
  ): Promise<void> {
    const { mood, title, introduction, minihompi_image } = dto;

    const user = await this.usersService.findUserById(userId);

    if (!user) throw new Error("유저가 존재하지 않습니다.");

    const existingMini = await this.miniRepository.findOne({
      where: { user: { id: userId } },
    });

    if (existingMini) {
      await this.miniRepository.delete({ id: existingMini.id });
    }

    const mini = this.miniRepository.create({
      user,
      title,
      mood,
      introduction,
      minihompi_image,
    });

    await this.miniRepository.save(mini);
  }

  // 미니홈피 정보 조회
  async getMinihomepiStatus(userId: number): Promise<MinihomepiStatusDto> {
    const mini = await this.miniRepository.findOne({
      where: { user: { id: userId } },
    });

    if (!mini) {
      return {
        title: null,
        mood: null,
        introduction: null,
        minihompi_image: null,
      };
    }

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
