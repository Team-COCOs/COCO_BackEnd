import {
  Controller,
  UseGuards,
  Patch,
  Body,
  Req,
  Param,
  Get,
} from "@nestjs/common";
import { MiniroomsService } from "./minirooms.service";
import { AuthGuard } from "@nestjs/passport";
import { Request } from "express";
import { ApiOperation } from "@nestjs/swagger";

@Controller("minirooms")
export class MiniroomsController {
  constructor(private readonly miniRoomService: MiniroomsService) {}

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

  @Get(":userId/layout")
  @ApiOperation({ summary: "유저 ID로 미니룸 배치 조회 (JWT 없음)" })
  async getMiniroomLayoutByUserId(@Param("userId") userId: number) {
    return await this.miniRoomService.getMiniroomLayoutByUser(userId);
  }
}
