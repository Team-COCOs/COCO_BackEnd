import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Query,
} from "@nestjs/common";
import { FriendsService } from "src/friends/friends.service";
import { UsersService } from "src/users/users.service";
import { VisitService } from "src/visit/visit.service";
import { MinihomepisService } from "./minihomepis.service";
import { OtherProfileDto } from "src/users/dto/otherUsers.dto";

@Controller("minihomepis")
export class MinihomepisController {
  constructor(
    private readonly usersService: UsersService,
    private readonly friendsService: FriendsService,
    private readonly visitService: VisitService,
    private readonly minihomepisService: MinihomepisService
  ) {}

  // 파도타기
  @Get("history/:hostId")
  async getOtherProfile(
    @Param("hostId") hostId: number
  ): Promise<OtherProfileDto> {
    const user = await this.usersService.findUserById(hostId);

    if (!user) throw new NotFoundException("유저 없음");

    // 일촌 목록 확인
    const friends = await this.friendsService.getFriends(user.id);

    console.log(friends);

    return {
      name: user.name,
      email: user.email,
      gender: user.gender,
      friends,
    };
  }

  // 방문자 수 조회
  @Get("count/:hostId")
  async getTotalVisits(@Param("hostId", ParseIntPipe) hostId: number) {
    const total = await this.visitService.countTotalVisits(hostId);
    const today = await this.visitService.countTodayVisits(hostId);

    return { hostId, total, today };
  }
}
