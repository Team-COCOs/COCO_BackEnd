import {
  Controller,
  UseGuards,
  Patch,
  Body,
  Req,
  Param,
  Get,
  Post,
} from "@nestjs/common";
import { MiniroomsService } from "./minirooms.service";
import { AuthGuard } from "@nestjs/passport";
import { Request } from "express";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { UseritemsService } from "src/useritems/useritems.service";

@Controller("minirooms")
export class MiniroomsController {
  constructor(
    private readonly miniRoomService: MiniroomsService,
    private readonly userItemsService: UseritemsService
  ) {}

  // 미니룸 배경
  @Post("background")
  @UseGuards(AuthGuard("jwt"))
  @ApiOperation({ summary: "미니룸 배경(스킨) 설정" })
  async saveBackground(
    @Body() body: { purchaseId: number | "default-miniroom" },
    @Req() req: Request
  ) {
    const userId = req.user["id"];

    console.log(body.purchaseId);
    await this.userItemsService.setMiniRoomBack(userId, body.purchaseId);
    return { message: "미니룸 배경 저장 완료" };
  }

  // 미니룸 배경 조회
  @Get(":userId/background")
  @ApiOperation({ summary: "유저 ID로 미니룸 배치 조회" })
  async getMiniroomBackByUserId(@Param("userId") userId: number) {
    return await this.userItemsService.getUserMiniRoom(userId);
  }

  // 미니룸 이름 저장
  @Patch("title")
  @UseGuards(AuthGuard("jwt"))
  @ApiOperation({ summary: "미니룸 타이틀 저장" })
  @ApiResponse({ status: 200, description: "미니룸 이름 저장 완료" })
  async saveMiniroomName(@Body() body: { name: string }, @Req() req: Request) {
    const userId = req.user["id"];
    await this.miniRoomService.saveMiniroomName(userId, body.name);
    return { message: "미니룸 이름 저장 완료" };
  }

  // 미니룸 이름 조회
  @Get(":userId/title")
  @ApiOperation({ summary: "유저 ID로 미니룸 배치 조회 (JWT 없음)" })
  async getMiniroomNameByUserId(@Param("userId") userId: number) {
    return await this.miniRoomService.getMiniroomName(userId);
  }

  // 미니미/말풍선 layout 저장
  @Post("save-layout")
  @UseGuards(AuthGuard("jwt"))
  @ApiOperation({ summary: "미니룸에 미니미/말풍선 저장 (유저 기준)" })
  async saveLayout(@Body() body: { items: any[] }, @Req() req: Request) {
    const userId = req.user["id"];
    await this.miniRoomService.saveMiniroomLayoutByUser(userId, body.items);
    console.log(body.items);
    return { message: "미니미/말풍선 위치 저장 완료" };
  }

  // 미니미/말풍선 layout 조회
  @Get(":userId/layout")
  @ApiOperation({ summary: "유저 ID로 미니룸 배치 조회 (JWT 없음)" })
  async getMiniroomLayoutByUserId(@Param("userId") userId: number) {
    return await this.miniRoomService.getMiniroomLayoutByUser(userId);
  }
}
