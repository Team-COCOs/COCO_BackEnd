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
import { ApiOperation } from "@nestjs/swagger";
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
    @Body() body: { purchaseId: number },
    @Req() req: Request
  ) {
    const userId = req.user["id"];
    return await this.userItemsService.setMiniRoomBack(userId, body.purchaseId);
  }

  // 미니미/말풍선 layout 저장
  @Patch("save-layout")
  @UseGuards(AuthGuard("jwt"))
  @ApiOperation({ summary: "미니룸에 미니미/말풍선 저장 (유저 기준)" })
  async saveLayout(@Body() body: { items: any[] }, @Req() req: Request) {
    const userId = req.user["id"];
    console.log(body.items, "sfasdfsadfasdf");
    return await this.miniRoomService.saveMiniroomLayoutByUser(
      userId,
      body.items
    );
  }

  // 미니미/말풍선 layout 조회
  @Get(":userId/layout")
  @ApiOperation({ summary: "유저 ID로 미니룸 배치 조회 (JWT 없음)" })
  async getMiniroomLayoutByUserId(@Param("userId") userId: number) {
    return await this.miniRoomService.getMiniroomLayoutByUser(userId);
  }
}
