import { Controller, Post, Body, UseGuards, Req, Get } from "@nestjs/common";
import { PurchasesService } from "./purchases.service";
import { AuthGuard } from "@nestjs/passport";
import { Request } from "express";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { PurchaseItemDto } from "./dto/purchases.dto";
import { PurchaseResDto } from "./dto/purchasesRes.dto";

@ApiTags("스토어 구매 내역")
@Controller("purchases")
@UseGuards(AuthGuard("jwt"))
export class PurchasesController {
  constructor(private readonly purchasesService: PurchasesService) {}

  @Post()
  @ApiOperation({ summary: "스토어 아이템 구매" })
  async buyItem(@Body() body: PurchaseItemDto, @Req() req: Request) {
    const userId = req.user["id"];
    return this.purchasesService.buyItem(userId, body.storeItemId);
  }

  @Get()
  @ApiOperation({ summary: "내가 구매한 아이템 목록" })
  @ApiResponse({ status: 200, type: [PurchaseResDto] })
  async getMyItems(@Req() req: Request): Promise<PurchaseResDto[]> {
    const userId = req.user["id"];
    return this.purchasesService.getUserPurchases(userId);
  }
}
