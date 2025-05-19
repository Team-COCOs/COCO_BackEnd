import { PhotosCommentsService } from "./photos_comments.service";

import {
  Controller,
  Post,
  Param,
  Req,
  UseGuards,
  Body,
  Get,
  Delete,
  ParseIntPipe,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Request } from "express";
import { UserRole } from "src/users/users.entity";

import { ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";
import { CommentResponseDto } from "./dto/commentRes.dto";
import { CreateCommentDto } from "./dto/createComment.dto";
import { GetCommentsResponseDto } from "./dto/getCommentRes.dto";
import { DeleteCommentResponseDto } from "./dto/deleteCommentRes.dto";

@Controller("photos-comments")
export class PhotosCommentsController {
  constructor(private readonly commentsService: PhotosCommentsService) {}

  // 댓글 게시
  @Post(":postId")
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  @ApiOperation({ summary: "댓글 작성" })
  @ApiResponse({
    status: 201,
    description: "댓글 생성 성공",
    type: CommentResponseDto,
  })
  async createComment(
    @Param("postId") postId: number,
    @Body() body: CreateCommentDto,
    @Req() req: Request
  ) {
    const userId = req.user["id"];

    try {
      const commentResponse = await this.commentsService.createComment(
        userId,
        postId,
        body.comment,
        body.parentId
      );

      return { ok: true, content: commentResponse };
    } catch (err) {
      return { ok: false, error: err.message || "Internal server error" };
    }
  }

  // @Get(":postId")
  // @ApiOperation({ summary: "게시글 댓글 목록 조회" })
  // @ApiResponse({ status: 200, type: GetCommentsResponseDto })
  // async getComments(@Param("postId") postId: number) {
  //   const comments = await this.commentsService.getCommentsByPost(postId);
  //   return { ok: true, comments, postId };
  // }

  // 댓글 삭제
  @Delete(":commentId")
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  @ApiOperation({ summary: "댓글 삭제" })
  @ApiResponse({ status: 200, type: DeleteCommentResponseDto })
  async deleteComment(
    @Param("commentId", ParseIntPipe) commentId: number,
    @Req() req: Request
  ) {
    const user = {
      id: req.user["id"],
      role: req.user["role"],
    };
    return await this.commentsService.deleteComment(commentId, user);
  }
}
