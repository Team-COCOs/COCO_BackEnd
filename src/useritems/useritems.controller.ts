import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
  Req,
  Patch,
} from "@nestjs/common";
import { UseritemsService } from "./useritems.service";
import { UserItem } from "./useritems.entity";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { Request } from "express";
@Controller("useritems")
@UseGuards(AuthGuard("jwt"))
export class UseritemsController {
  constructor(private readonly useritemsService: UseritemsService) {}

  // 대표 미니미 저장
  @Patch("set-minimi")
  @ApiOperation({ summary: "미니미 아이템 저장" })
  @ApiResponse({ status: 200, description: "미니미 아이템이 저장되었습니다." })
  async setMinimi(@Body() body: { purchaseId: number }, @Req() req: Request) {
    const { purchaseId } = body;
    const userId = (req.user as any).id;
    return await this.useritemsService.setMinimi(userId, purchaseId);
  }

  // 대표 미니미 조회
  @Get("minimi/profile-image")
  @ApiOperation({ summary: "대표 미니미 이미지 조회" })
  @ApiResponse({ status: 200, description: "대표 미니미 이미지 경로 반환" })
  async getMinimiProfileImage(
    @Req() req: Request
  ): Promise<{ minimi: string | null }> {
    const userId = (req.user as any).id;
    const minimi = await this.useritemsService.getUserMinimi(userId);
    return { minimi };
  }
}
