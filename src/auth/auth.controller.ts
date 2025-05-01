import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { ConfigService } from "@nestjs/config";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import { UsersService } from "../users/users.service";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService
  ) {}

  // 회원가입
  @Post("signup")
  async signUp(@Body() body: any) {
    const { email, password, name, phone, gender, birthday } = body;

    return await this.authService.signUp(
      email,
      password,
      name,
      phone,
      gender,
      birthday
    );
  }

  // 로그인
  @Post("localLogin")
  async login(@Body() body: any) {
    const { email, password } = body;

    const hashed = await bcrypt.hash("cocoworld", 10);
    console.log("🔐 Hashed Password:", hashed);

    return await this.authService.localLogin(email, password);
  }

  // 아이디 찾기
  @Post("findId")
  async findId(@Body() body: { name: string; phone: string }) {
    const { name, phone } = body;
    return await this.authService.findId(name, phone);
  }

  // 비밀번호 재설정 (비로그인 상태)
  @Patch("reset-password")
  async resetPassword(@Body() body: { email: string; newPassword: string }) {
    const { email, newPassword } = body;
    return await this.authService.resetPw(email, newPassword);
  }

  // 비밀번호 변경 (로그인 상태)
  @Patch("change-password")
  @UseGuards(AuthGuard("jwt"))
  async changePassword(
    @Req() req: Request,
    @Body() body: { newPassword: string }
  ) {
    const userId = req.user["id"];
    return await this.authService.changePw(userId, body.newPassword);
  }

  @Post("refresh")
  async refresh(@Req() req: Request): Promise<{
    ok: boolean;
    access_token?: string;
    refresh_token?: string;
    error?: string;
  }> {
    const authHeader = req.headers["authorization"];
    const refresh_token = authHeader?.split(" ")[1];

    if (!refresh_token) {
      return { ok: false, error: "Refresh token이 없습니다." };
    }

    try {
      const decoded = jwt.verify(
        refresh_token,
        this.configService.get<string>("JWT_REFRESH_TOKEN_SECRET_KEY")!
      ) as any;

      const user = await this.usersService.findUserById(Number(decoded.aud));
      if (!user || user.refresh_token !== refresh_token) {
        return { ok: false, error: "토큰이 만료되었거나 일치하지 않습니다." };
      }

      const { access_token } = await this.authService.issueTokens(user);

      if (!access_token) {
        return { ok: false, error: "access_token 발급 실패" };
      }

      return { ok: true, access_token, refresh_token };
    } catch (err) {
      return { ok: false, error: "토큰 검증 실패" };
    }
  }
}
