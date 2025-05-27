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
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";
import { Request } from "express";
import { FriendListDto, FriendRequestDto } from "./dto/friends.dto";
import { AcceptRejectDto } from "./dto/accept-reject.dto";
import { FriendStatusDto } from "./dto/status.dto";
@ApiTags("일촌")
@Controller("friends")
export class FriendsController {
  constructor(
    private readonly friendsService: FriendsService,
    private readonly usersService: UsersService
  ) {}

  // 요청 전 이름
  @Get("names/:userId")
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  @ApiOperation({ summary: "일촌 신청 전 상대방 이름 및 정보 조회" })
  @ApiParam({ name: "userId", type: Number, description: "상대 유저 ID" })
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
  @ApiBearerAuth()
  @ApiOperation({ summary: "일촌 신청" })
  @ApiBody({ type: FriendRequestDto })
  async requestFriend(@Body() body: FriendRequestDto, @Req() req: Request) {
    const requesterId = req.user["id"];
    const receiver = await this.usersService.findUserById(body.receiverId);
    if (!receiver)
      throw new NotFoundException("신청할 사용자를 찾을 수 없습니다.");
    await this.friendsService.request(
      requesterId,
      body.receiverId,
      body.requester_name,
      body.receiver_name,
      body.message
    );

    return { message: "일촌 신청이 전송되었습니다." };
  }

  // 수락
  @Post("accept")
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  @ApiOperation({ summary: "일촌 신청 수락" })
  @ApiBody({ type: AcceptRejectDto })
  async acceptFriend(@Body() body: AcceptRejectDto, @Req() req: Request) {
    const receiverId = req.user["id"];
    await this.friendsService.accept(body.requesterId, receiverId);
    return { message: "일촌 신청을 수락했습니다." };
  }

  // 거절
  @Post("reject")
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  @ApiOperation({ summary: "일촌 신청 거절" })
  @ApiBody({ type: AcceptRejectDto })
  async rejectFriend(@Body() body: AcceptRejectDto, @Req() req: Request) {
    const receiverId = req.user["id"];
    await this.friendsService.reject(body.requesterId, receiverId);
    return { message: "일촌 신청을 거절했습니다." };
  }

  // 일촌 목록
  @Get("list")
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  @ApiOperation({ summary: "일촌 목록 조회" })
  @ApiOkResponse({ type: FriendListDto, isArray: true })
  async getMainProfile(@Req() req: Request) {
    const userId = req.user["id"];
    const user = await this.usersService.findUserById(userId);
    if (!user) throw new NotFoundException("유저 없음");

    const friends = await this.friendsService.getFriends(userId);
    return { friends };
  }

  // 일촌 상태
  @Get("status/:userId")
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  @ApiOperation({ summary: "일촌 관계 상태 확인" })
  @ApiOkResponse({
    type: FriendStatusDto,
    description: "일촌 상태 확인 응답",
  })
  @ApiParam({ name: "userId", type: Number, description: "상대 유저 ID" })
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
  @ApiParam({
    name: "targetId",
    type: Number,
    description: "삭제할 상대 유저 ID",
  })
  @ApiOkResponse({ schema: { example: { ok: true } } })
  async unfriend(@Req() req: Request, @Param("targetId") targetId: number) {
    const userId = req.user["id"];
    return await this.friendsService.deleteFriend(userId, targetId);
  }
}
