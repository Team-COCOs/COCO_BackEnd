import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, MoreThanOrEqual } from "typeorm";
import { Visit } from "./visit.entity";
import { addHours, startOfDay, startOfToday } from "date-fns";
import { UsersService } from "src/users/users.service";

@Injectable()
export class VisitService {
  constructor(
    @InjectRepository(Visit)
    private readonly visitRepository: Repository<Visit>,

    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService
  ) {}

  // 방문자 수 (로그인/로그아웃)
  async visit(hostId: number, visitorId: number | null) {
    const host = await this.usersService.findUserById(hostId);
    if (!host) {
      throw new NotFoundException("존재하지 않는 미니홈피입니다.");
    }
    if (visitorId && hostId === visitorId) return;

    if (visitorId) {
      const now = new Date();
      const startOfDay = new Date(now);
      startOfDay.setHours(0, 0, 0, 0);

      const existing = await this.visitRepository.findOne({
        where: {
          host: { id: hostId },
          visitor: { id: visitorId },
          visitedAt: MoreThanOrEqual(startOfDay),
        },
      });

      if (existing) return;

      await this.visitRepository.save({
        host: { id: hostId },
        visitor: { id: visitorId },
      });
    } else {
      await this.visitRepository.save({
        host: { id: hostId },
        visitor: null,
      });
    }

    return { message: "방문 완료" };
  }

  // today 방문자 수
  async countTodayVisits(hostId: number): Promise<number> {
    const now = new Date();
    const koreaNow = addHours(now, 9); // 현재 시간을 KST로 보정
    const koreaStartOfToday = startOfDay(koreaNow); // 오늘 KST 자정
    const todayStartUTC = addHours(koreaStartOfToday, -9); // UTC로 변환

    const raw = await this.visitRepository
      .createQueryBuilder("visit")
      .select("COUNT(*)", "count")
      .where("visit.host_id = :hostId", { hostId })
      .andWhere("visit.visited_at >= :todayStart", {
        todayStart: todayStartUTC,
      })
      .getRawOne<{ count: string }>();

    return parseInt(raw.count, 10);
  }

  // 총 방문자 수
  async countTotalVisits(hostId: number): Promise<number> {
    const raw = await this.visitRepository
      .createQueryBuilder("visit")
      .select("COUNT(*)", "count")
      .where("visit.host_id = :hostId", { hostId })
      .getRawOne<{ count: string }>();

    return parseInt(raw.count, 10);
  }
}
