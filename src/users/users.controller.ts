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
import { DiaryService } from "src/diary/diary.service";
import { PhotosService } from "src/photos/photos.service";
import { FriendsService } from "src/friends/friends.service";
import { NewDiaryDto } from "src/diary/dto/diary.dto";
import { NewPhotoDto } from "src/photos/dto/photos.dto";

@Controller("users")
export class UsersController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly diarysService: DiaryService,
    private readonly photosService: PhotosService,
    private readonly friendsService: FriendsService
  ) {}

  // 메인화면 프로필
  @Get("profile")
  @UseGuards(AuthGuard("jwt"))
  async getProfile(@Req() req: Request) {
    const userId = req.user["id"];

    const user = await this.usersService.findUserById(userId);
    if (!user) throw new NotFoundException("유저 없음");

    const newDiary = await this.diarysService.getNewDiarys(userId);
    const newPhoto = await this.photosService.getNewPhotos(userId);

    const newPost: (NewDiaryDto | NewPhotoDto)[] = [
      ...newDiary,
      ...newPhoto,
    ].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const friendRequest =
      await this.friendsService.getNewFriendRequests(userId);

    const friends = await this.friendsService.getMyFriends(userId);

    return {
      name: user.name,
      todayVisit: 34,
      newPost,
      newPostCount: newPost.length,
      friendRequest,
      friendRequestCount: friendRequest.length,
      avatar: user.profile_image ?? "/avatarImg/default.png",
      dotoris: user.dotoris,
      friends: friends.map((f) => ({
        id: f.userId,
        name: f.name,
      })),
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
