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
  ParseIntPipe,
} from "@nestjs/common";
import { UseritemsService } from "./useritems.service";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { Request } from "express";
import { LanguageType } from "./useritems.entity";
@Controller("useritems")
export class UseritemsController {
  constructor(private readonly useritemsService: UseritemsService) {}

  // 대표 미니미 저장
  @Patch("set-minimi")
  @UseGuards(AuthGuard("jwt"))
  @ApiOperation({ summary: "미니미 아이템 저장" })
  @ApiResponse({ status: 200, description: "미니미 아이템이 저장되었습니다." })
  async setMinimi(
    @Body() body: { purchaseId: number | "default-minimi" },
    @Req() req: Request
  ) {
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
      return {
        id: null,
        file: null,
      };
    }

    return {
      id: minimi.id,
      file: minimi.file,
    };
  }

  // 대표 bgm 저장
  @Patch("set-bgm")
  @UseGuards(AuthGuard("jwt"))
  @ApiOperation({ summary: "bgm 아이템 저장" })
  @ApiResponse({ status: 200, description: "bgm 아이템이 저장되었습니다." })
  async setBGM(@Body() body: { bgmId: number }, @Req() req: Request) {
    // store_item_id
    const { bgmId } = body;
    const userId = (req.user as any).id;

    return await this.useritemsService.setBGM(userId, bgmId);
  }

  // 대표 bgm 조회
  @Get("bgm/:userId")
  @ApiOperation({ summary: "대표 미니미 이미지 조회" })
  @ApiResponse({ status: 200, description: "대표 미니미 이미지 경로 반환" })
  async getMainBGM(
    @Param("userId") userId: number
  ): Promise<{ id: number; file: string }[]> {
    const bgms = await this.useritemsService.getUserBGM(userId);

    if (!bgms || bgms.length === 0) {
      return [];
    }

    return bgms;
  }

  // 언어 저장
  @Patch("set-language")
  @UseGuards(AuthGuard("jwt"))
  async setLanguage(
    @Body("language") language: LanguageType,
    @Req() req: Request
  ) {
    const userId = (req.user as any).id;
    return this.useritemsService.setLanguage(userId, language);
  }

  // 언어 조회
  @Get("language/:userId")
  async getLanguage(@Param("userId", ParseIntPipe) userId: number) {
    return this.useritemsService.getUserLanguage(userId);
  }

  // 탭 저장
  @Patch("set-tabs")
  @UseGuards(AuthGuard("jwt"))
  async setTabs(@Body("tabs") tabs: string[], @Req() req: Request) {
    const userId = (req.user as any).id;

    return this.useritemsService.setTabs(userId, tabs);
  }

  // 탭 조회
  @Get("tabs/:userId")
  async getTabs(@Param("userId", ParseIntPipe) userId: number) {
    return this.useritemsService.getTabs(userId);
  }

  // 미니홈피 배경 저장
  @Patch("set-minihomepis")
  @UseGuards(AuthGuard("jwt"))
  @ApiOperation({ summary: "미니홈피 스킨 저장" })
  @ApiResponse({
    status: 200,
    description: "미니홈피 아이템이 저장되었습니다.",
  })
  async setMinihomepis(
    @Body() body: { purchaseId: number | "default-minihomepis" },
    @Req() req: Request
  ) {
    const { purchaseId } = body;
    const userId = (req.user as any).id;
    console.log(purchaseId, "sdfasdfasdfa");
    return await this.useritemsService.setMinihomepis(userId, purchaseId);
  }

  // 미니홈피 배경 조회
  @Get("minihomepis/:userId")
  @ApiOperation({ summary: "대표 미니미 이미지 조회" })
  async getMinihomepis(
    @Param("userId") userId: number
  ): Promise<{ id: number; file: string }> {
    const minihomepis = await this.useritemsService.getUserMinihomepis(userId);

    if (!minihomepis) {
      return {
        id: null,
        file: null,
      };
    }

    return {
      id: minihomepis.id,
      file: minihomepis.file,
    };
  }

  // 다이어리 배경 저장
  @Patch("set-BK")
  @UseGuards(AuthGuard("jwt"))
  @ApiOperation({ summary: "다이어리 배경 저장" })
  @ApiResponse({
    status: 200,
    description: "다이어리 배경 아이템이 저장되었습니다.",
  })
  async setDK(
    @Body() body: { purchaseId: number | "default-bk" },
    @Req() req: Request
  ) {
    const { purchaseId } = body;
    const userId = (req.user as any).id;

    return await this.useritemsService.setDK(userId, purchaseId);
  }

  // 다이어리 배경 조회
  @Get("bk/:userId")
  @ApiOperation({ summary: "다이어리 배경 조회" })
  async getDK(
    @Param("userId") userId: number
  ): Promise<{ id: number; file: string }> {
    const bk = await this.useritemsService.getUserDK(userId);

    if (!bk) {
      return {
        id: null,
        file: null,
      };
    }

    return {
      id: bk.id,
      file: bk.file,
    };
  }

  // 탭 컬러 저장
  @Patch("set-tapcolor")
  @UseGuards(AuthGuard("jwt"))
  @ApiOperation({ summary: "탭 색깔 저장" })
  @ApiResponse({
    status: 200,
    description: "탭 컬러 아이템이 저장되었습니다.",
  })
  async settapcolor(
    @Body() body: { purchaseId: number | "default-tapcolor" },
    @Req() req: Request
  ) {
    const { purchaseId } = body;
    const userId = (req.user as any).id;

    return await this.useritemsService.setTapColor(userId, purchaseId);
  }

  // 탭 컬러 조회
  @Get("tapcolor/:userId")
  @ApiOperation({ summary: "탭 컬러 조회" })
  async getTapColor(
    @Param("userId") userId: number
  ): Promise<{ id: number; file: string }> {
    const tapcolor = await this.useritemsService.getUserTapColor(userId);

    if (!tapcolor) {
      return {
        id: null,
        file: null,
      };
    }

    return {
      id: tapcolor.id,
      file: tapcolor.file,
    };
  }
}
