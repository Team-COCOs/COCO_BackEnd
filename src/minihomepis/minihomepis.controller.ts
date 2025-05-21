import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
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
  async getTotalVisits(@Param("hostId", ParseIntPipe) hostId: number) {
    const total = await this.visitService.countTotalVisits(hostId);
    const today = await this.visitService.countTodayVisits(hostId);

    return { hostId, total, today };
  }

  // 미니홈피 정보 저장
  @Post("info")
  @UseGuards(AuthGuard("jwt"))
  @UseInterceptors(
    FileInterceptor("minihompi_image", {
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
  async updateMyMinihomepi(
    @UploadedFile() file: Express.Multer.File,
    @Body()
    body: {
      name: string;
      status: string;
      introduction: string;
      minihompi_image_url: string | null;
    },
    @Req() req: Request
  ) {
    const userId = req.user["id"];

    let imageUrl: string | null = null;

    if (file) {
      imageUrl = `http://localhost:5001/uploads/${file.filename}`;
    } else if (
      body.minihompi_image_url &&
      typeof body.minihompi_image_url === "string"
    ) {
      imageUrl = body.minihompi_image_url;
    } else {
      imageUrl = null;
    }

    await this.minihomepisService.saveMinihomepiInfo(userId, {
      title: body.name,
      mood: body.status,
      introduction: body.introduction,
      minihompi_image: imageUrl,
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
  async setManagement(@Req() req: Request, @Body("quote") quote: string) {
    const userId = req.user["id"];
    return await this.minihomepisService.setManagement(userId, quote);
  }

  // 관리글 조회
  @Get("management/:userId")
  async getManagement(@Param("userId") userId: number) {
    return await this.minihomepisService.getManagement(userId);
  }

  // 최근에 올린 사진첩 title 2개
  @Get("photo/:userId")
  async getRecentTitles(@Param("userId", ParseIntPipe) userId: number) {
    const titles = await this.photosService.getRecentPhotoTitles(userId);
    return { titles };
  }

  // 카운트
  @Get("postCount/:userId")
  async getPostCount(@Param("userId", ParseIntPipe) userId: number) {
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
