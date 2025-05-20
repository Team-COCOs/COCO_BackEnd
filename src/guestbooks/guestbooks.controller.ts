import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { GuestbooksService } from "./guestbooks.service";
import { AuthGuard } from "@nestjs/passport";
import { Request } from "express";
import { VisibilityStatus } from "./guestbooks.entity";

@Controller("guestbooks")
export class GuestbooksController {
  constructor(private readonly guestbooksService: GuestbooksService) {}

  // 등록
  @Post()
  @UseGuards(AuthGuard("jwt"))
  async createFriendComment(
    @Body("miniUserId") miniUserId: number,
    @Body("content") content: string,
    @Body("status") status: VisibilityStatus,
    @Req() req: Request
  ) {
    const authorId = req.user["id"];

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
  async getComments(@Param("hostId") hostId: number, @Req() req: Request) {
    const viewId = req.user["id"];
    const comments = await this.guestbooksService.getComments(hostId, viewId);
    return {
      message: "일촌평 조회 성공",
      data: comments,
    };
  }

  // 비밀로 하기
  @Patch("status/:commentId")
  @UseGuards(AuthGuard("jwt"))
  async changeVisibility(
    @Param("commentId") commentId: number,
    @Body("status") status: VisibilityStatus,
    @Req() req: Request
  ) {
    const userId = req.user["id"];
    const comments = await this.guestbooksService.changeVisibility(
      userId,
      commentId,
      status
    );
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
    return this.guestbooksService.delete(authorId, hostId);
  }
}
