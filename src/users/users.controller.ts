import {
  BadRequestException,
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
import {
  ApiTags,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
} from "@nestjs/swagger";
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
import { ChangePasswordDto } from "./dto/updateInfo.dto";
import { ChangePhoneDto } from "./dto/updateInfo.dto";
import { UserRoleDto } from "./dto/userProfile.dto";
import { MainProfileDto } from "./dto/main.dto";
import { PopularUserDto } from "./dto/popular.dto";

@ApiTags("유저")
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
  @ApiBearerAuth()
  @ApiOperation({ summary: "자신의 유저 프로필 조회" })
  @ApiOkResponse({ type: UserProfileDto })
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

  // 메인화면용 프로필
  @Get("mainProfile")
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  @ApiOperation({ summary: "메인화면용 프로필 데이터" })
  @ApiOkResponse({ type: MainProfileDto })
  async getMainProfile(@Req() req: Request) {
    const userId = req.user["id"];
    const user = await this.usersService.findUserById(userId);
    if (!user) throw new NotFoundException("유저 없음");

    const todayVisit = await this.visitService.countTodayVisits(userId);
    const newDiary = await this.diaryService.getNewDiarys(userId);
    const newPhoto = await this.photosService.getNewPhotos(userId);

    const newPost: (NewDiaryDto | NewPhotoDto)[] = [
      ...newDiary,
      ...newPhoto,
    ].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    const friendRequest =
      await this.friendsService.getNewFriendRequests(userId);
    const friends = await this.friendsService.getFriends(userId);

    return {
      name: user.name,
      todayVisit,
      newPostCount: newPost.length,
      friendRequest,
      friendRequestCount: friendRequest.length,
      profile_image: user.minimi_image ?? null,
      dotoris: user.dotoris,
      friends,
    };
  }

  // 비밀번호 변경
  @Patch("update/password")
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  @ApiOperation({ summary: "비밀번호 변경" })
  @ApiBody({ type: ChangePasswordDto })
  async changePassword(@Req() req: Request, @Body() body: ChangePasswordDto) {
    const userId = req.user["id"];
    return await this.usersService.changePw(userId, body.password);
  }

  // 전화번호 변경
  @Patch("update/phone")
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  @ApiOperation({ summary: "전화번호 변경" })
  @ApiBody({ type: ChangePhoneDto })
  async changePhone(@Req() req: Request, @Body() body: ChangePhoneDto) {
    const userId = req.user["id"];
    return await this.usersService.changePhone(userId, body.phone);
  }

  // 유저 id 이름 조회
  @Get("id")
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  @ApiOperation({ summary: "모든 유저의 ID 및 이름 조회" })
  @ApiOkResponse({ type: [UserIdNameDto] })
  async getAllUserIds() {
    return this.usersService.getAllUserId();
  }

  // 유저 검색
  @Get("search")
  @ApiOperation({ summary: "키워드로 유저 검색" })
  @ApiQuery({ name: "keyword", required: true, description: "검색 키워드" })
  @ApiOkResponse({ type: [SearchUserDto] })
  async searchUsers(
    @Query("keyword") keyword: string
  ): Promise<SearchUserDto[]> {
    return this.usersService.searchUsers(keyword);
  }

  // 화제의 미니홈피 5명
  @Get("getPopularUser")
  @ApiOperation({ summary: "화제의 미니홈피 Top 5" })
  @ApiOkResponse({
    description: "총 방문자 수 기준 Top 5 유저 목록",
    type: [PopularUserDto],
  })
  async getHotMinihomepis() {
    return this.minihomepisService.getTop5HotMinihomepis();
  }

  // 탈퇴 처리
  @Patch("delete")
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  @ApiOperation({ summary: "회원 탈퇴 처리 (soft delete)" })
  async setDeleteUser(@Req() req: Request) {
    const userId = req.user["id"];
    return await this.usersService.withdrawUser(userId);
  }

  // 유저 역할 확인
  @Get("role/:userId")
  @ApiOperation({ summary: "유저 역할 정보 확인" })
  @ApiOkResponse({ type: UserRoleDto })
  async getUserById(@Param("userId") userId: number) {
    return await this.usersService.getUserRole(userId);
  }

  // 파도타기
  @Get("wave/:hostId")
  @ApiOperation({ summary: "파도타기 (랜덤 유저 조회)" })
  @ApiParam({
    name: "hostId",
    type: Number,
    description: "현재 유저 ID (자기 자신 제외 대상)",
  })
  @ApiQuery({
    name: "exclude",
    type: Number,
    required: false,
    description: "직전에 방문한 유저 ID (선택적 제외 대상)",
  })
  @ApiOkResponse({
    description: "랜덤 유저 ID 반환",
    schema: {
      example: { userId: 11 },
    },
  })
  async getRandomUser(
    @Param("hostId") hostId: string,
    @Query("exclude") exclude?: string
  ) {
    const parsedHostId = Number(hostId);
    const parsedExclude = exclude ? Number(exclude) : null;

    if (isNaN(parsedHostId)) {
      throw new BadRequestException("유효한 hostId가 아닙니다.");
    }

    if (exclude && isNaN(parsedExclude)) {
      throw new BadRequestException("유효한 exclude ID가 아닙니다.");
    }

    const excludeIds = [parsedHostId];
    if (parsedExclude !== null) {
      excludeIds.push(parsedExclude);
    }

    const userId = await this.usersService.getRandomUserExcept(excludeIds);
    return { userId };
  }
}
