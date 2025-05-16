import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { DiaryService } from "./diary.service";
import { AuthGuard } from "@nestjs/passport";
import { SaveDiaryFolderDto } from "./dto/diaryFolder.dto";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { DiaryFolder } from "./diaryFolder.entity";
import { Diary } from "./diary.entity";
import { SaveDiaryDto } from "./dto/diary.dto";
import { Request } from "express";

@Controller("diary")
export class DiaryController {
  constructor(private readonly diaryService: DiaryService) {}

  // 폴더 구조 생성
  @Post("saveTree")
  @UseGuards(AuthGuard("jwt"))
  async saveFolderTree(
    @Body("folders") folders: SaveDiaryFolderDto[],
    @Req() req
  ) {
    const userId = req.user.id;

    const result = await this.diaryService.saveFolderTree(folders, userId);

    return {
      success: true,
      message: result.message,
    };
  }

  // 폴더 조회
  @Get("folderList")
  @ApiOperation({ summary: "사용자의 폴더 트리 조회" })
  @ApiResponse({
    status: 200,
    description: "사용자의 폴더 트리가 조회되었습니다.",
    type: [DiaryFolder],
  })
  async getFolderTree(
    @Query("userId", ParseIntPipe) userId: number
  ): Promise<DiaryFolder[]> {
    return await this.diaryService.getFolder(userId);
  }

  // 다이어리 저장
  @Post("save")
  @UseGuards(AuthGuard("jwt"))
  @ApiOperation({ summary: "다이어리 저장" })
  @ApiResponse({
    status: 201,
    description: "다이어리가 저장되었습니다.",
    type: Diary,
  })
  async saveDiary(
    @Body() dto: SaveDiaryDto,
    @Req() req: Request
  ): Promise<Diary> {
    const userId = req.user["id"];

    return await this.diaryService.saveDiary(userId, dto);
  }

  // 다이어리 조회
  @Get(":hostId")
  @UseGuards(AuthGuard("jwt"))
  @ApiOperation({ summary: "다이어리 목록 조회" })
  @ApiResponse({
    status: 200,
    description: "사용자 사진 목록 반환",
    type: [Diary],
  })
  async getDiary(
    @Param("hostId", ParseIntPipe) hostId: number,
    @Req() req: Request
  ): Promise<Diary[]> {
    const viewerId = req.user["id"];
    return await this.diaryService.getPhotosByUser(hostId, viewerId);
  }

  // 로그아웃 유저 다이어리 조회
  @Get("logout/:hostId")
  @ApiOperation({ summary: "사진첩 조회 (비로그인 상태)" })
  @ApiResponse({
    status: 200,
    description: "공개 사진 리스트",
    type: [Diary],
  })
  async getPhotosForLogoutUser(
    @Param("hostId", ParseIntPipe) hostId: number
  ): Promise<Diary[]> {
    return await this.diaryService.getDiaryByLogout(hostId);
  }
}
