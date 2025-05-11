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

  // 미니미 아이템 저장
  @Patch("set-minimi")
  @ApiOperation({ summary: "미니미 아이템 저장" })
  @ApiResponse({ status: 200, description: "미니미 아이템이 저장되었습니다." })
  async setMinimi(@Body() body: { storeItemId: string }, @Req() req: Request) {
    const { storeItemId } = body;
    const storeItemIdAsNumber = Number(storeItemId);
    const userId = (req.user as any).id;

    console.log(userId, storeItemIdAsNumber, "sfasdfasdfasd");
    return await this.useritemsService.setMinimi(userId, storeItemIdAsNumber);
  }
}

// 미니미 아이템 조회
// @Get(":userId/minimi/:storeItemId")
// @ApiOperation({ summary: "저장된 미니미 아이템 조회" })
// @ApiResponse({
//   status: 200,
//   description: "저장된 미니미 아이템이 조회되었습니다.",
//   type: UserItem,
// })
// async getMinimi(
//   @Param("storeItemId") storeItemId: number,
//   @Req() req: Request
// ): Promise<UserItem> {
//   const userId = (req.user as any).id;
//   return await this.useritemsService.getMinimi(userId, storeItemId);
// }
