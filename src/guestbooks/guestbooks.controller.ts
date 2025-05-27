import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { GuestbooksService } from "./guestbooks.service";
import { AuthGuard } from "@nestjs/passport";
import { Request } from "express";
import { VisibilityStatus } from "./guestbooks.entity";
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";
import { CreateGuestbookDto } from "./dto/create.dto";
import { GuestbookResponseDto } from "./dto/guestbookRes.dto";
import {
  GuestbookDeleteMessageDto,
  GuestbookToggleMessageDto,
} from "./dto/message.dto";

@ApiTags("방명록")
@Controller("guestbooks")
export class GuestbooksController {
  constructor(private readonly guestbooksService: GuestbooksService) {}

  // 등록
  @Post()
  @UseGuards(AuthGuard("jwt"))
  @ApiBody({ type: CreateGuestbookDto })
  @ApiCreatedResponse({
    type: GuestbookResponseDto,
    description: "방명록 등록 성공",
  })
  @ApiOperation({ summary: "방명록 등록" })
  async createFriendComment(
    @Body() createGuestbookDto: CreateGuestbookDto,
    @Req() req: Request
  ) {
    const authorId = req.user["id"];
    const { miniUserId, content, status } = createGuestbookDto;

    const result = await this.guestbooksService.create(
      authorId,
      miniUserId,
      content,
      status
    );

    return {
      message: "일촌평이 등록되었습니다.",
      data: result,
    };
  }

  // 조회
  @Get(":hostId")
  @ApiOperation({ summary: "방명록 조회" })
  @ApiParam({ name: "hostId", example: 3, description: "미니홈피 주인의 ID" })
  @ApiOkResponse({
    type: GuestbookResponseDto,
    isArray: true,
    description: "방명록 조회 성공",
  })
  async getComments(
    @Param("hostId") hostId: number,
    @Query("viewer") viewId?: number
  ) {
    const comments = await this.guestbooksService.getComments(hostId, viewId);
    return {
      message: "일촌평 조회 성공",
      data: comments,
    };
  }

  // 비밀로 하기
  @Patch("status/:id")
  @ApiOperation({ summary: "방명록 공개/비공개 토글" })
  @UseGuards(AuthGuard("jwt"))
  @ApiParam({ name: "id", example: 7, description: "방명록 ID" })
  @ApiOkResponse({
    type: GuestbookToggleMessageDto,
    description: "공개/비공개 전환 성공",
  })
  async toggleVisibility(@Param("id") id: number, @Req() req: Request) {
    const userId = req.user["id"];
    const result = await this.guestbooksService.toggleVisibility(userId, id);
    return {
      message: result.message,
      status: result.status,
    };
  }

  // 삭제
  @Delete(":guestbookId")
  @ApiOperation({ summary: "방명록 삭제" })
  @UseGuards(AuthGuard("jwt"))
  @ApiParam({
    name: "guestbookId",
    example: 12,
    description: "삭제할 방명록 ID",
  })
  @ApiOkResponse({
    type: GuestbookDeleteMessageDto,
    description: "방명록 삭제 성공",
  })
  async deleteComment(
    @Param("guestbookId") guestbookId: number,
    @Req() req: Request
  ) {
    const userId = req.user["id"];
    return this.guestbooksService.delete(guestbookId, userId);
  }
}
