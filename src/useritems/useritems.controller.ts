import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
  Req,
  Patch,
  NotFoundException,
} from "@nestjs/common";
import { UseritemsService } from "./useritems.service";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { Request } from "express";
@Controller("useritems")
export class UseritemsController {
  constructor(private readonly useritemsService: UseritemsService) {}

  // 대표 미니미 저장
  @Patch("set-minimi")
  @UseGuards(AuthGuard("jwt"))
  @ApiOperation({ summary: "미니미 아이템 저장" })
  @ApiResponse({ status: 200, description: "미니미 아이템이 저장되었습니다." })
  async setMinimi(@Body() body: { purchaseId: number }, @Req() req: Request) {
    const { purchaseId } = body;
    const userId = (req.user as any).id;
    return await this.useritemsService.setMinimi(userId, purchaseId);
  }

  // 대표 미니미 조회
  @Get("minimi/profile-image/:userId")
  @ApiOperation({ summary: "대표 미니미 이미지 조회" })
  @ApiResponse({ status: 200, description: "대표 미니미 이미지 경로 반환" })
  async getMinimiProfileImage(
    @Param("userId") userId: number
  ): Promise<{ id: number; file: string }> {
    const minimi = await this.useritemsService.getUserMinimi(userId);

    if (!minimi) {
      throw new NotFoundException("대표 미니미가 설정되지 않았습니다.");
    }

    return {
      id: minimi.id,
      file: minimi.file,
    };
  }
}
