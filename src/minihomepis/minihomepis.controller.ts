import { Controller, Get, NotFoundException, Param } from "@nestjs/common";
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

  @Get("hostProfile")
  async getOtherProfile(
    @Param("hostId") hostId: number
  ): Promise<OtherProfileDto> {
    const user = await this.usersService.findUserById(hostId);
    if (!user) throw new NotFoundException("유저 없음");

    // 일촌 목록 확인
    const friends = await this.friendsService.getMyFriends(hostId);

    return {
      name: user.name,
      email: user.email,
      gender: user.gender,
      friends,
    };
  }
}
