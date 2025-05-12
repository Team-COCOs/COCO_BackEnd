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
import { ApiConsumes, ApiOkResponse, ApiOperation } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import {
  MinihomepiInfoDto,
  MinihomepiStatusDto,
} from "./dto/minihomepiInfo.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";

@Controller("minihomepis")
export class MinihomepisController {
  constructor(
    private readonly usersService: UsersService,
    private readonly friendsService: FriendsService,
    private readonly visitService: VisitService,
    private readonly minihomepisService: MinihomepisService
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
    },
    @Req() req: Request
  ) {
    const userId = req.user["id"];

    const imageUrl = file
      ? `http://localhost:5001/uploads/${file.filename}`
      : undefined;

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
}
