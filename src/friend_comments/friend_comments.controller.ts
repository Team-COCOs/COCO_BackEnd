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

@Controller("friend-comments")
@UseGuards(AuthGuard("jwt"))
export class FriendCommentsController {
  constructor(private readonly friendCommentsService: FriendCommentsService) {}

  // 등록
  @Post()
  async createFriendComment(
    @Body("hostId") hostId: number,
    @Body("content") content: string,
    @Req() req: any
  ) {
    const authorId = req.user.id;

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
  async getComment(@Param("hostId") hostId: number, @Req() req: any) {
    const authorId = req.user.id;
    const comment = await this.friendCommentsService.getComment(
      authorId,
      hostId
    );

    return {
      message: "일촌평 조회 성공",
      data: comment,
    };
  }

  // 삭제
  @Delete(":hostId")
  async deleteComment(@Param("hostId") hostId: number, @Req() req: any) {
    const authorId = req.user.id;

    return this.friendCommentsService.delete(authorId, hostId);
  }
}
