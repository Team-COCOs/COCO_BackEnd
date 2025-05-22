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
import { ApiOperation, ApiParam, ApiResponse } from "@nestjs/swagger";
import { Request } from "express";
import { AuthGuard } from "@nestjs/passport";
import { AdminGuard } from "../auth/guards/admin.guard";
import { UserRole } from "../users/users.entity";
interface JwtUser {
  id: number;
  role: UserRole;
}
@Controller("admin")
@UseGuards(AuthGuard("jwt"), AdminGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // 유저 조회
  @Get("users")
  @ApiOperation({ summary: "모든 유저 조회" })
  async getUsers(@Req() req: Request) {
    const user = req.user as JwtUser;
    const users = await this.adminService.getAllUsers(user);
    return { ok: true, users };
  }

  // 유저 삭제
  @Delete("users/:id")
  @ApiOperation({ summary: "유저 삭제 (강제 탈퇴)" })
  @ApiParam({ name: "id", type: Number })
  async deleteUser(@Param("id", ParseIntPipe) id: number, @Req() req: Request) {
    const user = req.user as JwtUser;
    await this.adminService.deleteUserAsAdmin(id, user);
    return { ok: true };
  }

  // 총 가입자 수
  @Get("users/total")
  @ApiOperation({ summary: "총 가입자 수 (관리자/탈퇴자 제외)" })
  async totalSignupCount(@Req() req: Request) {
    const user = req.user as JwtUser;
    const count = await this.adminService.totalSignupUser(user);
    return { ok: true, count };
  }

  // 오늘 가입자 수
  @Get("users/daily")
  @ApiOperation({ summary: "일별 가입자 수 (KST 기준, 관리자/탈퇴자 제외)" })
  async todaySignupCount(@Req() req: Request) {
    const user = req.user as JwtUser;
    const count = await this.adminService.todaySignupUser(user);
    const today = new Date().toISOString().split("T")[0];
    return {
      ok: true,
      daily: [{ date: today, count }],
    };
  }

  // 월별 가입자 수
  @Get("users/monthly")
  @ApiOperation({ summary: "월별 가입자 수 (KST 기준, 관리자/탈퇴자 제외)" })
  async monthlySignupStats(@Req() req: Request) {
    const user = req.user as JwtUser;
    const data = await this.adminService.monthSignupUser(user);
    return { ok: true, data };
  }

  // 전체 결제 내역
  @Get("payments")
  @ApiOperation({ summary: "전체 결제 내역 조회" })
  async getAllPayments(@Req() req: Request) {
    const user = req.user as JwtUser;
    const payments = await this.adminService.getAllPayments(user);
    return { ok: true, payments };
  }

  // 결제 수
  @Get("payments/count")
  @ApiOperation({ summary: "전체 결제 건수" })
  async getPaymentsCount(@Req() req: Request) {
    const user = req.user as JwtUser;
    const count = await this.adminService.getPaymentsCount(user);
    return { ok: true, count };
  }

  // 총 결제 금액
  @Get("payments/total")
  @ApiOperation({ summary: "총 결제 금액" })
  async getTotalPaymentAmount(@Req() req: Request) {
    const user = req.user as JwtUser;
    const amount = await this.adminService.getTotalPaymentAmount(user);
    return { ok: true, amount };
  }

  // 일별 결제 금액
  @Get("payments/daily")
  @ApiOperation({ summary: "일별 결제 금액 (KST 기준)" })
  async getDailyPaymentStats(@Req() req: Request) {
    const user = req.user as JwtUser;
    const daily = await this.adminService.getDailyPaymentAmounts(user);
    return { ok: true, daily };
  }
}
