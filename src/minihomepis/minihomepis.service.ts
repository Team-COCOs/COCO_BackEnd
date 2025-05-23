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
import { VisitService } from "src/visit/visit.service";

@Injectable()
export class MinihomepisService {
  constructor(
    @InjectRepository(Minihomepi)
    private readonly miniRepository: Repository<Minihomepi>,

    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,

    private readonly visitService: VisitService
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

  // 미니홈피 정보 저장
  async saveMinihomepiInfo(
    userId: number,
    dto: MinihomepiInfoDto
  ): Promise<void> {
    const { mood, title, introduction, minihomepi_image } = dto;

    const user = await this.usersService.findUserById(userId);

    if (!user) throw new NotFoundException("유저가 존재하지 않습니다.");

    const existingMini = await this.miniRepository.findOne({
      where: { user: { id: userId } },
    });

    if (existingMini) {
      existingMini.title = title;
      existingMini.mood = mood;
      existingMini.introduction = introduction;
      existingMini.minihomepi_image = minihomepi_image;
      await this.miniRepository.save(existingMini);
    } else {
      const newMini = this.miniRepository.create({
        user,
        title,
        mood,
        introduction,
        minihomepi_image,
      });
      await this.miniRepository.save(newMini);
    }
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
        minihomepi_image: null,
      };
    }

    return {
      title: mini.title,
      mood: mini.mood,
      introduction: mini.introduction,
      minihomepi_image: mini.minihomepi_image,
    };
  }

  // 화재의 미니홈피
  async getTop5HotMinihomepis() {
    const allMinihomepis = await this.miniRepository.find({
      relations: ["user"],
    });

    const results = await Promise.all(
      allMinihomepis.map(async (m) => {
        const totalVisitCount = await this.visitService.countTotalVisits(
          m.user.id
        );
        return {
          userId: m.user.id,
          user_role: m.user.role,
          name: m.user.name,
          totalVisitCount,
        };
      })
    );

    return results
      .sort((a, b) => b.totalVisitCount - a.totalVisitCount)
      .slice(0, 5);
  }

  // 방명록에 관리글 저장
  async setManagement(userId: number, quote: string) {
    const minihomepi = await this.miniRepository.findOne({
      where: { user: { id: userId } },
    });

    if (!minihomepi) {
      throw new NotFoundException("미니홈피가 존재하지 않습니다.");
    }

    minihomepi.quote = quote;
    await this.miniRepository.save(minihomepi);
    return { message: "관리글이 저장되었습니다." };
  }

  // 방명록에 관리글 조회
  async getManagement(userId: number) {
    const minihomepi = await this.miniRepository.findOne({
      where: { user: { id: userId } },
    });

    return { content: minihomepi.quote ?? "" };
  }
}
