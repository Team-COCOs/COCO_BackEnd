import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { FriendCommentsService } from "./friend_comments.service";
import { AuthGuard } from "@nestjs/passport";
import { Request } from "express";

@Controller("friend-comments")
export class FriendCommentsController {
  constructor(private readonly friendCommentsService: FriendCommentsService) {}

  // 등록
  @Post()
  @UseGuards(AuthGuard("jwt"))
  async createFriendComment(
    @Body("hostId") hostId: number,
    @Body("content") content: string,
    @Req() req: Request
  ) {
    const authorId = req.user["id"];

    const result = await this.friendCommentsService.create(
      authorId,
      hostId,
      content
    );

    return {
      message: "일촌평이 등록되었습니다.",
      data: result,
    };
  }

  // 조회
  @Get(":hostId")
  async getComments(@Param("hostId") hostId: number) {
    const comments = await this.friendCommentsService.getComments(hostId);
    return {
      message: "일촌평 조회 성공",
      data: comments,
    };
  }

  // 삭제
  @Delete(":hostId")
  @UseGuards(AuthGuard("jwt"))
  async deleteComment(@Param("hostId") hostId: number, @Req() req: Request) {
    const authorId = req.user["id"];
    return this.friendCommentsService.delete(authorId, hostId);
  }
}
