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

@ApiTags("Users")
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

  @Get("mainProfile")
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  @ApiOperation({ summary: "메인화면용 프로필 데이터" })
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
      newPost,
      newPostCount: newPost.length,
      friendRequest,
      friendRequestCount: friendRequest.length,
      profile_image: user.minimi_image ?? null,
      dotoris: user.dotoris,
      friends,
    };
  }

  @Patch("update/password")
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  @ApiOperation({ summary: "비밀번호 변경" })
  @ApiBody({ type: ChangePasswordDto })
  async changePassword(@Req() req: Request, @Body() body: ChangePasswordDto) {
    const userId = req.user["id"];
    return await this.usersService.changePw(userId, body.password);
  }

  @Patch("update/phone")
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  @ApiOperation({ summary: "전화번호 변경" })
  @ApiBody({ type: ChangePhoneDto })
  async changePhone(@Req() req: Request, @Body() body: ChangePhoneDto) {
    const userId = req.user["id"];
    return await this.usersService.changePhone(userId, body.phone);
  }

  @Get("id")
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  @ApiOperation({ summary: "모든 유저의 ID 및 이름 조회" })
  @ApiOkResponse({ type: [UserIdNameDto] })
  async getAllUserIds() {
    return this.usersService.getAllUserId();
  }

  @Get("search")
  @ApiOperation({ summary: "키워드로 유저 검색" })
  @ApiQuery({ name: "keyword", required: true, description: "검색 키워드" })
  @ApiOkResponse({ type: [SearchUserDto] })
  async searchUsers(
    @Query("keyword") keyword: string
  ): Promise<SearchUserDto[]> {
    return this.usersService.searchUsers(keyword);
  }

  @Get("getPopularUser")
  @ApiOperation({ summary: "화제의 미니홈피 Top 5" })
  async getHotMinihomepis() {
    return this.minihomepisService.getTop5HotMinihomepis();
  }

  @Patch("delete")
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  @ApiOperation({ summary: "회원 탈퇴 처리 (soft delete)" })
  async setDeleteUser(@Req() req: Request) {
    const userId = req.user["id"];
    return await this.usersService.withdrawUser(userId);
  }

  @Get("role/:userId")
  @ApiOperation({ summary: "유저 역할 정보 확인" })
  @ApiOkResponse({ type: UserRoleDto })
  async getUserById(@Param("userId") userId: number) {
    return await this.usersService.getUserRole(userId);
  }

  @Get("wave/:hostId")
  @ApiOperation({ summary: "파도타기 (랜덤 유저 조회)" })
  async getRandomUser(@Param("hostId") hostId: string) {
    const parsed = Number(hostId);
    if (isNaN(parsed)) {
      throw new BadRequestException("유효한 hostId가 아닙니다.");
    }

    const userId = await this.usersService.getRandomUserExcept(parsed);
    return { userId };
  }
}
