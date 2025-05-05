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

    return await this.visitRepository.count({
      where: {
        host: { id: userId },
        visitedAt: MoreThanOrEqual(todayStart),
      },
    });
  }

  // 총 방문자 수
  async countTotalVisits(userId: number): Promise<number> {
    return await this.visitRepository.count({
      where: {
        host: { id: userId },
      },
    });
  }
}
