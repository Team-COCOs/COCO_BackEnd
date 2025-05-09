import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, MoreThanOrEqual } from "typeorm";
import { Visit } from "./visit.entity";
import { startOfToday } from "date-fns";

@Injectable()
export class VisitService {
  constructor(
    @InjectRepository(Visit)
    private readonly visitRepository: Repository<Visit>
  ) {}

  // 방문자 수 체크
  async visitOncePerDay(hostId: number, visitorId: number) {
    if (hostId === visitorId) return;

    const now = new Date();
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    const existing = await this.visitRepository.findOne({
      where: {
        host: { id: hostId },
        visitor: { id: visitorId },
        visitedAt: MoreThanOrEqual(startOfDay),
      },
    });

    if (!existing) {
      await this.visitRepository.save({
        host: { id: hostId },
        visitor: { id: visitorId },
      });
    }
  }

  // today 방문자 수
  async countTodayVisits(hostId: number): Promise<number> {
    const todayStart = startOfToday(); // 00:00:00

    const raw = await this.visitRepository
      .createQueryBuilder("visit")
      .select("COUNT(DISTINCT visit.visitor_id)", "count")
      .where("visit.host_id = :hostId", { hostId })
      .andWhere("visit.visited_at >= :todayStart", { todayStart })
      .getRawOne<{ count: string }>();

    return parseInt(raw.count, 10);
  }

  // 총 방문자 수
  async countTotalVisits(hostId: number): Promise<number> {
    const raw = await this.visitRepository
      .createQueryBuilder("visit")
      .select("COUNT(DISTINCT visit.visitor_id)", "count")
      .where("visit.host_id = :hostId", { hostId })
      .getRawOne<{ count: string }>();

    return parseInt(raw.count, 10);
  }
}
