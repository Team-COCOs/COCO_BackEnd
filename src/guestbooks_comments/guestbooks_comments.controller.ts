import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  Req,
  UseGuards,
  ParseIntPipe,
} from "@nestjs/common";
import { GuestbooksCommentsService } from "./guestbooks_comments.service";
import { AuthGuard } from "@nestjs/passport";
import { Request } from "express";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags("방명록 댓글")
@Controller("guestbooks-comments")
export class GuestbooksCommentsController {
  constructor(
    private readonly guestbookCommentsService: GuestbooksCommentsService
  ) {}

  // 댓글 작성
  @Post(":guestbookId")
  @UseGuards(AuthGuard("jwt"))
  @ApiOperation({ summary: "방명록 댓글 작성" })
  async createComment(
    @Param("guestbookId", ParseIntPipe) guestbookId: number,
    @Body("content") content: string,
    @Req() req: Request
  ) {
    const userId = req.user["id"];
    return await this.guestbookCommentsService.createComment(
      userId,
      guestbookId,
      content
    );
  }

  // 댓글 삭제
  @Delete(":commentId")
  @UseGuards(AuthGuard("jwt"))
  @ApiOperation({ summary: "방명록 댓글 삭제" })
  async deleteComment(
    @Param("commentId", ParseIntPipe) commentId: number,
    @Req() req: Request
  ) {
    const userId = req.user["id"];
    return await this.guestbookCommentsService.deleteComment(commentId, userId);
  }
}
