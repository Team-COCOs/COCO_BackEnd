// friends.controller.ts
import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  NotFoundException,
  Get,
  Param,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { FriendsService } from "./friends.service";
import { UsersService } from "../users/users.service";

@Controller("friends")
@UseGuards(AuthGuard("jwt"))
export class FriendsController {
  constructor(
    private readonly friendsService: FriendsService,
    private readonly usersService: UsersService
  ) {}

  // 요청
  @Post("request")
  async requestFriend(@Body("receiverId") receiverId: number, @Req() req: any) {
    const requesterId = req.user.id;
    const requester = await this.usersService.findUserById(requesterId);
    const receiver = await this.usersService.findUserById(receiverId);
    if (!receiver) {
      throw new NotFoundException("신청할 사용자를 찾을 수 없습니다.");
    }

    await this.friendsService.request(
      requesterId,
      receiverId,
      requester.name,
      receiver.name
    );
    return { message: "일촌 신청이 전송되었습니다." };
  }

  // 수락
  @Post("accept")
  async acceptFriend(
    @Body("requesterId") requesterId: number,
    @Req() req: any
  ) {
    const receiverId = req.user.id;
    await this.friendsService.accept(requesterId, receiverId);
    return { message: "일촌 신청을 수락했습니다." };
  }

  // 거절
  @Post("reject")
  async rejectFriend(
    @Body("requesterId") requesterId: number,
    @Req() req: any
  ) {
    const receiverId = req.user.id;
    await this.friendsService.reject(requesterId, receiverId);
    return { message: "일촌 신청을 거절했습니다." };
  }

  // 일촌 상태
  @Get("status/:userId")
  async checkFollowStatus(@Param("userId") userId: string, @Req() req: any) {
    const receiverId = parseInt(userId, 10);
    const requesterId = req.user.id;
    return this.friendsService.friendStatus(requesterId, receiverId);
  }
}
