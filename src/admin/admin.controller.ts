import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Req,
  UseGuards,
} from "@nestjs/common";
import { AdminService } from "./admin.service";
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { Request } from "express";
import { AuthGuard } from "@nestjs/passport";
import { AdminGuard } from "../auth/guards/admin.guard";
import { UserRole } from "../users/users.entity";
import {
  DailyPaymentAmountResDto,
  DailySignupResDto,
  MonthlySignupResDto,
  PaymentCountDto,
  PaymentListDto,
  TotalPaymentAmountDto,
  UserCountDto,
  UserListResDto,
} from "./dto/admin.dto";

interface JwtUser {
  id: number;
  role: UserRole;
}

@ApiTags("관리자")
@Controller("admin")
@UseGuards(AuthGuard("jwt"), AdminGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // 유저 조회
  @Get("users")
  @ApiOperation({ summary: "모든 유저 조회" })
  @ApiOkResponse({ type: UserListResDto })
  async getUsers(@Req() req: Request) {
    const user = req.user as JwtUser;
    const users = await this.adminService.getAllUsers(user);
    return { ok: true, users };
  }

  // 유저 삭제
  @Delete("users/:id")
  @ApiOperation({ summary: "유저 삭제 (강제 탈퇴)" })
  @ApiParam({ name: "id", type: Number })
  @ApiResponse({ status: 200, description: "삭제 완료" })
  async deleteUser(@Param("id", ParseIntPipe) id: number, @Req() req: Request) {
    const user = req.user as JwtUser;
    await this.adminService.deleteUserAsAdmin(id, user);
    return { ok: true };
  }

  // 총 가입자 수
  @Get("users/total")
  @ApiOperation({ summary: "총 가입자 수 (관리자/탈퇴자 제외)" })
  @ApiOkResponse({ type: UserCountDto })
  async totalSignupCount(@Req() req: Request) {
    const user = req.user as JwtUser;
    const count = await this.adminService.totalSignupUser(user);
    return { ok: true, count };
  }

  // 오늘 가입자 수
  @Get("users/daily")
  @ApiOperation({ summary: "일별 가입자 수 (KST 기준, 관리자/탈퇴자 제외)" })
  @ApiOkResponse({ type: DailySignupResDto })
  async todaySignupCount(@Req() req: Request) {
    const user = req.user as JwtUser;
    const count = await this.adminService.todaySignupUser(user);
    const today = new Date();
    const dateKST = new Date(today.getTime() + 9 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];

    return {
      ok: true,
      daily: [{ date: dateKST, count }],
    };
  }

  // 월별 가입자 수
  @Get("users/monthly")
  @ApiOperation({ summary: "월별 가입자 수 (KST 기준, 관리자/탈퇴자 제외)" })
  @ApiOkResponse({ type: MonthlySignupResDto })
  async monthlySignupStats(@Req() req: Request) {
    const user = req.user as JwtUser;
    const data = await this.adminService.monthSignupUser(user);
    return { ok: true, data };
  }

  // 전체 결제 내역
  @Get("payments")
  @ApiOperation({ summary: "전체 결제 내역 조회" })
  @ApiOkResponse({ type: PaymentListDto })
  async getAllPayments(@Req() req: Request) {
    const user = req.user as JwtUser;
    const payments = await this.adminService.getAllPayments(user);
    return { ok: true, payments };
  }

  // 결제 수
  @Get("payments/count")
  @ApiOperation({ summary: "전체 결제 건수" })
  @ApiOkResponse({ type: PaymentCountDto })
  async getPaymentsCount(@Req() req: Request) {
    const user = req.user as JwtUser;
    const count = await this.adminService.getPaymentsCount(user);
    return { ok: true, count };
  }

  // 총 결제 금액
  @Get("payments/total")
  @ApiOperation({ summary: "총 결제 금액" })
  @ApiOkResponse({ type: TotalPaymentAmountDto })
  async getTotalPaymentAmount(@Req() req: Request) {
    const user = req.user as JwtUser;
    const amount = await this.adminService.getTotalPaymentAmount(user);
    return { ok: true, amount };
  }

  // 일별 결제 금액
  @Get("payments/daily")
  @ApiOperation({ summary: "일별 결제 금액 (KST 기준)" })
  @ApiOkResponse({ type: DailyPaymentAmountResDto })
  async getDailyPaymentStats(@Req() req: Request) {
    const user = req.user as JwtUser;
    const daily = await this.adminService.getDailyPaymentAmounts(user);
    return { ok: true, daily };
  }
}
