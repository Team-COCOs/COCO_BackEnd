import {
  Controller,
  Get,
  NotFoundException,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "src/auth/auth.service";
import { UsersService } from "./users.service";
import { Request, Response } from "express";

@Controller("users")
export class UsersController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService
  ) {}
  @Get("profile")
  @UseGuards(AuthGuard("jwt"))
  async getProfile(@Req() req: Request) {
    const userId = req.user["id"];

    const user = await this.usersService.findUserById(userId);
    if (!user) throw new NotFoundException("유저 없음");

    return {
      name: user.name,
      todayVisit: 34, // 추후 DB에서 방문자 수 가져오면 바꾸기
      newPost: 1, // 추후 게시글 수 가져오면 바꾸기
      friendRequest: 2, // 추후 일촌 신청 수로 바꾸기
      avatar: user.profile_image ?? "/avatarImg/default.png",
      dotoris: user.dotoris,
      friends: [
        { id: 1, name: "김지은" },
        { id: 2, name: "박민수" },
        { id: 3, name: "최다혜" },
      ], // 추후 실제 친구 목록 연결
    };
  }
}
