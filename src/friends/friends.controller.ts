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
  Delete,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { FriendsService } from "./friends.service";
import { UsersService } from "../users/users.service";
import { ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { Request } from "express";

@Controller("friends")
export class FriendsController {
  constructor(
    private readonly friendsService: FriendsService,
    private readonly usersService: UsersService
  ) {}

  // 요청 전 이름
  @Get("names/:userId")
  @UseGuards(AuthGuard("jwt"))
  async getUserNames(@Param("userId") userId: string, @Req() req: Request) {
    const requesterId = req.user["id"];

    const receiverId = parseInt(userId, 10);

    const result = await this.friendsService.getNames(requesterId, receiverId);

    return {
      requesterId,
      receiverId,
      ...result,
    };
  }

  // 요청
  @Post("request")
  @UseGuards(AuthGuard("jwt"))
  async requestFriend(
    @Body("receiverId") receiverId: number,
    @Body("requester_name") requester_name: string,
    @Body("receiver_name") receiver_name: string,
    @Body("message") message: string,
    @Req() req: Request
  ) {
    const requesterId = req.user["id"];
    const requester = await this.usersService.findUserById(requesterId);
    const receiver = await this.usersService.findUserById(receiverId);
    if (!receiver) {
      throw new NotFoundException("신청할 사용자를 찾을 수 없습니다.");
    }

    await this.friendsService.request(
      requesterId,
      receiverId,
      requester_name,
      receiver_name,
      message
    );

    return { message: "일촌 신청이 전송되었습니다." };
  }

  // 수락
  @Post("accept")
  @UseGuards(AuthGuard("jwt"))
  async acceptFriend(
    @Body("requesterId") requesterId: number,
    @Req() req: Request
  ) {
    const receiverId = req.user["id"];
    await this.friendsService.accept(requesterId, receiverId);
    return { message: "일촌 신청을 수락했습니다." };
  }

  // 거절
  @Post("reject")
  @UseGuards(AuthGuard("jwt"))
  async rejectFriend(
    @Body("requesterId") requesterId: number,
    @Req() req: Request
  ) {
    const receiverId = req.user["id"];
    await this.friendsService.reject(requesterId, receiverId);
    return { message: "일촌 신청을 거절했습니다." };
  }

  @Get("list")
  @UseGuards(AuthGuard("jwt"))
  async getMainProfile(@Req() req: Request) {
    const userId = req.user["id"];

    const user = await this.usersService.findUserById(userId);
    if (!user) throw new NotFoundException("유저 없음");

    // 일촌 목록 확인
    const friends = await this.friendsService.getFriends(userId);

    return {
      friends,
    };
  }

  // 일촌 상태
  @Get("status/:userId")
  @UseGuards(AuthGuard("jwt"))
  async checkFollowStatus(
    @Param("userId") userId: string,
    @Req() req: Request
  ) {
    const receiverId = parseInt(userId, 10);
    const requesterId = req.user["id"];

    if (!requesterId) {
      return {
        areFriends: false,
        requested: false,
        received: false,
      };
    }

    return this.friendsService.friendStatus(requesterId, receiverId);
  }

  // 일촌 삭제
  @Delete(":targetId")
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  @ApiOperation({ summary: "일촌 삭제" })
  async unfriend(@Req() req: Request, @Param("targetId") targetId: number) {
    const userId = req.user["id"];
    return await this.friendsService.deleteFriend(userId, targetId);
  }
}
