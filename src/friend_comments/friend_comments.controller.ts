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
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import {
  FriendCommentDto,
  FriendCommentResponseDto,
} from "./dto/friend_comments.dto";
@ApiTags("일촌평")
@Controller("friend-comments")
export class FriendCommentsController {
  constructor(private readonly friendCommentsService: FriendCommentsService) {}

  // 등록
  @Post()
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  @ApiOperation({ summary: "일촌평 등록" })
  @ApiBody({ type: FriendCommentDto })
  @ApiResponse({
    status: 201,
    description: "일촌평이 등록되었습니다.",
    type: FriendCommentResponseDto,
  })
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
  @ApiOperation({ summary: "일촌평 조회" })
  @ApiResponse({
    status: 200,
    description: "일촌평 목록 조회 성공",
    type: [FriendCommentResponseDto],
  })
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
  @ApiBearerAuth()
  @ApiOperation({ summary: "일촌평 삭제" })
  @ApiResponse({
    status: 200,
    description: "일촌평이 삭제되었습니다.",
  })
  async deleteComment(@Param("hostId") hostId: number, @Req() req: Request) {
    const authorId = req.user["id"];
    return this.friendCommentsService.delete(authorId, hostId);
  }
}
