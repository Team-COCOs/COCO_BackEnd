import {
  Controller,
  Get,
  NotFoundException,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "src/auth/auth.service";
import { UsersService } from "./users.service";
import { Request, Response } from "express";
import { ApiOperation, ApiQuery } from "@nestjs/swagger";
import { SearchUserDto } from "./dto/users.dto";

@Controller("users")
export class UsersController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService
  ) {}

  // 메인화면 프로필
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
      ],
    };
  }

  // 키워드로 검색
  @Get("search")
  @ApiOperation({ summary: "키워드로 유저 검색" })
  @ApiQuery({ name: "keyword", required: true, description: "검색 키워드" })
  async searchUsers(
    @Query("keyword") keyword: string
  ): Promise<SearchUserDto[]> {
    return this.usersService.searchUsers(keyword);
  }
}
