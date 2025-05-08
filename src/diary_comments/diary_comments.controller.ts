import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { DiaryCommentsService } from "./diary_comments.service";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { UserRole } from "src/users/users.entity";
import {
  CommentResponseDto,
  CreateCommentDto,
  DeleteCommentResponseDto,
  GetCommentsResponseDto,
} from "./dto/diary_comments.dto";
interface AuthRequest extends Request {
  user: {
    id: number;
    role: UserRole;
  };
}
@Controller("diaryComments")
export class DiaryCommentsController {
  constructor(private readonly diaryCommentsService: DiaryCommentsService) {}

  @Post("comment/:diaryId")
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  @ApiOperation({ summary: "댓글 작성" })
  @ApiResponse({
    status: 201,
    description: "댓글 생성 성공",
    type: CommentResponseDto,
  })
  async createComment(
    @Param("diaryId") diaryId: number,
    @Body() body: CreateCommentDto,
    @Req() req: AuthRequest
  ) {
    const userId = req.user.id;

    try {
      const commentResponse =
        await this.diaryCommentsService.createDiaryComment(
          userId,
          diaryId,
          body.content,
          body.parentCommentId
        );

      return { ok: true, content: commentResponse };
    } catch (err) {
      return { ok: false, error: err.message || "Internal server error" };
    }
  }

  @Get("comment/:diaryId")
  @ApiOperation({ summary: "게시글 댓글 목록 조회" })
  @ApiResponse({ status: 200, type: GetCommentsResponseDto })
  async getComments(@Param("diaryId") diaryId: number) {
    const comments =
      await this.diaryCommentsService.getCommentsByDiary(diaryId);
    return { ok: true, comments, diaryId };
  }

  @Delete("comment/:commentId")
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  @ApiOperation({ summary: "댓글 삭제" })
  @ApiResponse({ status: 200, type: DeleteCommentResponseDto })
  async deleteComment(
    @Param("commentId", ParseIntPipe) commentId: number,
    @Req() req: AuthRequest
  ) {
    const user = {
      id: req.user.id,
      role: req.user.role,
    };
    return await this.diaryCommentsService.deleteDiaryComment(commentId, user);
  }
}
