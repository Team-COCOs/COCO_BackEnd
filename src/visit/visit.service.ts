import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, MoreThanOrEqual } from "typeorm";
import { Visit } from "./visit.entity";
import { startOfToday } from "date-fns";
import { User } from "src/users/users.entity";

@Injectable()
export class VisitService {
  constructor(
    @InjectRepository(Visit)
    private readonly visitRepository: Repository<Visit>
  ) {}

  // today 방문자 수
  async countTodayVisits(userId: number): Promise<number> {
    const todayStart = startOfToday(); // 00:00:00

    const raw = await this.visitRepository
      .createQueryBuilder("visit")
      .select("COUNT(DISTINCT visit.visitor_id)", "count")
      .where("visit.host_id = :hostId", { hostId: userId })
      .andWhere("visit.visited_at >= :todayStart", { todayStart })
      .getRawOne<{ count: string }>();

    return parseInt(raw.count, 10);
  }

  // 총 방문자 수
  async countTotalVisits(userId: number): Promise<number> {
    const raw = await this.visitRepository
      .createQueryBuilder("visit")
      .select("COUNT(DISTINCT visit.visitor_id)", "count")
      .where("visit.host_id = :hostId", { hostId: userId })
      .getRawOne<{ count: string }>();

    return parseInt(raw.count, 10);
  }
}
