import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { UsersService } from "./users.service";
import { Request } from "express";
import { ApiOkResponse, ApiOperation, ApiQuery } from "@nestjs/swagger";
import { SearchUserDto } from "./dto/searchUsers.dto";
import { DiaryService } from "../diary/diary.service";
import { PhotosService } from "../photos/photos.service";
import { FriendsService } from "../friends/friends.service";
import { NewDiaryDto } from "../diary/dto/diary.dto";
import { NewPhotoDto } from "../photos/dto/photos.dto";
import { VisitService } from "../visit/visit.service";
import { UserProfileDto } from "./dto/userProfile.dto";
import { UserIdNameDto } from "./dto/userIdName.dto";
import { MinihomepisService } from "src/minihomepis/minihomepis.service";
import { UseritemsService } from "src/useritems/useritems.service";

@Controller("users")
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly diaryService: DiaryService,
    private readonly photosService: PhotosService,
    private readonly friendsService: FriendsService,
    private readonly visitService: VisitService,
    private readonly minihomepisService: MinihomepisService,
    private readonly useritemsService: UseritemsService
  ) {}

  // 유저 프로필
  @Get("profile")
  @UseGuards(AuthGuard("jwt"))
  async getProfile(@Req() req: Request): Promise<UserProfileDto> {
    const userId = req.user["id"];

    const user = await this.usersService.findUserById(userId);
    if (!user) throw new NotFoundException("유저 없음");

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      gender: user.gender,
      profile_image: user.minimi_image ?? null,
      role: user.role,
      dotoris: user.dotoris,
      birthday: user.birthday,
    };
  }

  // 메인화면 프로필
  @Get("mainProfile")
  @UseGuards(AuthGuard("jwt"))
  async getMainProfile(@Req() req: Request) {
    const userId = req.user["id"];

    const user = await this.usersService.findUserById(userId);
    if (!user) throw new NotFoundException("유저 없음");

    // 오늘 방문자 수
    const todayVisit = await this.visitService.countTodayVisits(userId);

    // 다이어리 새 글
    const newDiary = await this.diaryService.getNewDiarys(userId);

    // 사진첩 새 글
    const newPhoto = await this.photosService.getNewPhotos(userId);

    // 다이어리, 사진첩 새 글 오름차순
    const newPost: (NewDiaryDto | NewPhotoDto)[] = [
      ...newDiary,
      ...newPhoto,
    ].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    // 일촌 요청 확인
    const friendRequest =
      await this.friendsService.getNewFriendRequests(userId);

    // 일촌 목록 확인
    const friends = await this.friendsService.getFriends(userId);

    return {
      name: user.name,
      todayVisit,
      newPost,
      newPostCount: newPost.length,
      friendRequest,
      friendRequestCount: friendRequest.length,
      profile_image: user.minimi_image ?? null,
      dotoris: user.dotoris,
      friends,
    };
  }

  // 비밀번호 변경 (로그인 상태)
  @Patch("update/password")
  @UseGuards(AuthGuard("jwt"))
  async changePassword(
    @Req() req: Request,
    @Body() body: { password: string }
  ) {
    const userId = req.user["id"];
    return await this.usersService.changePw(userId, body.password);
  }

  // 비밀번호 변경 (로그인 상태)
  @Patch("update/phone")
  @UseGuards(AuthGuard("jwt"))
  async changePhone(@Req() req: Request, @Body() body: { phone: string }) {
    const userId = req.user["id"];
    return await this.usersService.changePhone(userId, body.phone);
  }

  // 모든 유저 id 조회
  @Get("id")
  @UseGuards(AuthGuard("jwt"))
  @ApiOperation({ summary: "모든 유저의 ID 및 이름 조회" })
  @ApiOkResponse({ type: [UserIdNameDto] })
  async getAllUserIds() {
    return this.usersService.getAllUserId();
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

  // 화재의 미니홈피
  @Get("getPopularUser")
  @ApiOperation({ summary: "화제의 미니홈피 Top 5" })
  async getHotMinihomepis() {
    return this.minihomepisService.getTop5HotMinihomepis();
  }

  // 탈퇴 유저로 수정
  @Patch("delete")
  @UseGuards(AuthGuard("jwt"))
  async setDeleteUser(@Req() req: Request) {
    const userId = req.user["id"];
    return await this.usersService.withdrawUser(userId);
  }

  // 유저 역할 확인
  @Get("role/:id")
  async getUserById(@Param("id") id: number) {
    return await this.usersService.getUserRole(id);
  }
}
