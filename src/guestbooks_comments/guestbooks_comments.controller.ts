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
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";
import { CreateGuestbookCommentDto } from "./dto/create.dto";
import { GuestbookCommentResponseDto } from "./dto/createRes.dto";
import { GuestbookCommentDeleteResponseDto } from "./dto/delete.dto";

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
  @ApiParam({ name: "guestbookId", example: 3, description: "방명록 ID" })
  @ApiBody({ type: CreateGuestbookCommentDto })
  @ApiCreatedResponse({
    type: GuestbookCommentResponseDto,
    description: "댓글 작성 성공",
  })
  async createComment(
    @Param("guestbookId", ParseIntPipe) guestbookId: number,
    @Body() body: CreateGuestbookCommentDto,
    @Req() req: Request
  ) {
    const userId = req.user["id"];
    return await this.guestbookCommentsService.createComment(
      userId,
      guestbookId,
      body.content
    );
  }

  // 댓글 삭제
  @Delete(":commentId")
  @UseGuards(AuthGuard("jwt"))
  @ApiOperation({ summary: "방명록 댓글 삭제" })
  @ApiParam({ name: "commentId", example: 7, description: "댓글 ID" })
  @ApiOkResponse({
    type: GuestbookCommentDeleteResponseDto,
    description: "댓글 삭제 성공",
  })
  async deleteComment(
    @Param("commentId", ParseIntPipe) commentId: number,
    @Req() req: Request
  ) {
    const userId = req.user["id"];
    return await this.guestbookCommentsService.deleteComment(commentId, userId);
  }
}
