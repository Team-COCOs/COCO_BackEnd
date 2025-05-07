import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { PaymentsService } from "./payments.service";
import { CreatePaymentDto } from "./dto/payments.dto";
import { Request } from "express";
import { ApiOkResponse, ApiOperation } from "@nestjs/swagger";

@Controller("pay")
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get("tossClientKey")
  @ApiOperation({
    summary: "Toss Client Key 조회",
    description:
      "프론트에서 결제를 요청할 때 사용하는 Toss Client Key를 반환합니다.",
  })
  @ApiOkResponse({ description: "Toss Client Key 반환" })
  getTossClientKey() {
    return { tossClientKey: process.env.TOSS_CLIENT_KEY };
  }

  @Post("save")
  @UseGuards(AuthGuard("jwt"))
  async createPayment(
    @Req() req: Request,
    @Body() { dotori }: CreatePaymentDto
  ) {
    const userId = (req.user as any).id;
    if (!userId) throw new NotFoundException("유저 정보가 없습니다.");
    return this.paymentsService.createPayment(userId, dotori);
  }

  @Get()
  async getMyPayments(@Req() req: Request) {
    const userId = (req.user as any).id;
    return this.paymentsService.getPaymentByUser(userId);
  }
}
