import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";

import { Request } from "express";

import { FriendsService } from "src/friends/friends.service";
import { UsersService } from "src/users/users.service";
import { VisitService } from "src/visit/visit.service";
import { MinihomepisService } from "./minihomepis.service";
import { OtherProfileDto } from "src/users/dto/otherUsers.dto";
import {
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { MinihomepiStatusDto } from "./dto/minihomepiInfo.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";
import { PhotosService } from "src/photos/photos.service";
import { DiaryService } from "src/diary/diary.service";
import { GuestbooksService } from "src/guestbooks/guestbooks.service";
import * as dotenv from "dotenv";
import { RecentPhotoTitleDto } from "src/photos/dto/recentPhotoTitle.dto";
import { VisitCountDto } from "./dto/visitCount.dto";
import { ManagementResDto } from "./dto/managementRes.dto";
import { PostCountDto } from "./dto/postCount.dto";
dotenv.config();
@ApiTags("미니홈피")
@Controller("minihomepis")
export class MinihomepisController {
  constructor(
    private readonly usersService: UsersService,
    private readonly friendsService: FriendsService,
    private readonly visitService: VisitService,
    private readonly minihomepisService: MinihomepisService,
    private readonly photosService: PhotosService,
    private readonly diaryService: DiaryService,
    private readonly guestbookService: GuestbooksService
  ) {}

  // 파도타기
  @Get("history/:hostId")
  @ApiOperation({ summary: "타인의 미니홈피 프로필 조회 (파도타기)" })
  @ApiOkResponse({ type: OtherProfileDto })
  async getOtherProfile(
    @Param("hostId") hostId: number
  ): Promise<OtherProfileDto> {
    const user = await this.usersService.findUserById(hostId);

    if (!user) throw new NotFoundException("유저 없음");

    // 일촌 목록 확인
    const friends = await this.friendsService.getFriends(user.id);

    return {
      name: user.name,
      email: user.email,
      gender: user.gender,
      friends,
    };
  }

  // 방문자 수 조회
  @Get("count/:hostId")
  @ApiOperation({ summary: "방문자 수 조회" })
  @ApiResponse({ status: 200, type: VisitCountDto })
  async getTotalVisits(
    @Param("hostId", ParseIntPipe) hostId: number
  ): Promise<VisitCountDto> {
    const total = await this.visitService.countTotalVisits(hostId);
    const today = await this.visitService.countTodayVisits(hostId);

    return { hostId, total, today };
  }

  // 미니홈피 정보 저장
  @Post("info")
  @UseGuards(AuthGuard("jwt"))
  @UseInterceptors(
    FileInterceptor("minihomepi_image", {
      storage: diskStorage({
        destination: "./uploads",
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + "-" + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    })
  )
  @ApiConsumes("multipart/form-data")
  @ApiOperation({ summary: "내 미니홈피 상태 저장 (무드/소개글/제목/이미지)" })
  @ApiResponse({ status: 200, description: "내 미니 홈피 상태 저장 완료" })
  async updateMyMinihomepi(
    @UploadedFile() file: Express.Multer.File,
    @Body()
    body: {
      name: string;
      status: string;
      introduction: string;
      minihomepi_image_url: string | null;
    },
    @Req() req: Request
  ) {
    const userId = req.user["id"];

    let imageUrl: string | null = null;

    const serverHost = process.env.SERVER_HOST;

    if (file) {
      imageUrl = `${serverHost}/uploads/${file.filename}`;
    } else if (
      body.minihomepi_image_url &&
      typeof body.minihomepi_image_url === "string"
    ) {
      imageUrl = body.minihomepi_image_url;
    } else {
      imageUrl = null;
    }

    await this.minihomepisService.saveMinihomepiInfo(userId, {
      title: body.name,
      mood: body.status,
      introduction: body.introduction,
      minihomepi_image: imageUrl,
    });
    return { message: "저장 완료" };
  }

  // 미니홈피 조회
  @Get(":userId/my-status")
  @ApiOperation({ summary: "내 미니홈피 상태 정보 조회" })
  @ApiOkResponse({ type: MinihomepiStatusDto })
  async getMyMinihomepi(
    @Param("userId") userId: number
  ): Promise<MinihomepiStatusDto> {
    return this.minihomepisService.getMinihomepiStatus(userId);
  }

  // 관리글 저장
  @Patch("management")
  @UseGuards(AuthGuard("jwt"))
  @ApiOperation({ summary: "관리글 저장" })
  @ApiResponse({ status: 200, description: "관리글 저장 완료" })
  async setManagement(@Req() req: Request, @Body("quote") quote: string) {
    const userId = req.user["id"];
    return await this.minihomepisService.setManagement(userId, quote);
  }

  // 관리글 조회
  @Get("management/:userId")
  @ApiOperation({ summary: "관리글 조회" })
  @ApiOkResponse({ type: ManagementResDto })
  async getManagement(
    @Param("userId", ParseIntPipe) userId: number
  ): Promise<ManagementResDto> {
    return await this.minihomepisService.getManagement(userId);
  }

  // 최근에 올린 사진첩 title 2개
  @Get("photo/:userId")
  @ApiOperation({ summary: "최근 사진첩 제목 2개 가져오기" })
  @ApiResponse({
    status: 200,
    description: "최신 사진첩 제목 리스트",
    type: [RecentPhotoTitleDto],
  })
  async getRecentTitles(
    @Param("userId", ParseIntPipe) userId: number
  ): Promise<RecentPhotoTitleDto[]> {
    return await this.photosService.getRecentPhotoTitles(userId);
  }

  // 카운트
  @Get("postCount/:userId")
  @ApiOperation({ summary: "오늘 및 전체 게시물 수 조회" })
  @ApiOkResponse({ type: PostCountDto })
  async getPostCount(
    @Param("userId", ParseIntPipe) userId: number
  ): Promise<PostCountDto> {
    const photoCount = await this.photosService.getTodayPhotoCount(userId);
    const photoTotalCount = await this.photosService.getTotalPhotoCount(userId);
    const diaryCount = await this.diaryService.getTodayDiaryCount(userId);
    const diaryTotalCount = await this.diaryService.getTotalDiaryCount(userId);
    const guestBookCount =
      await this.guestbookService.getTodayGuestBookCount(userId);
    const guestBookTotalCount =
      await this.guestbookService.getTotalGuestBookCount(userId);

    return {
      photoCount,
      photoTotalCount,
      diaryCount,
      diaryTotalCount,
      guestBookCount,
      guestBookTotalCount,
      cocoCount: 1,
      cocoTotalCount: 1,
    };
  }
}
