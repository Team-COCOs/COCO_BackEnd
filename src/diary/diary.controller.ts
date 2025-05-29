import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { DiaryService } from "./diary.service";
import { AuthGuard } from "@nestjs/passport";
import { DiaryFolderResDto, SaveDiaryFolderDto } from "./dto/diaryFolder.dto";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { DiaryFolder } from "./diaryFolder.entity";
import { Diary } from "./diary.entity";
import { DeleteDiaryResponseDto, SaveDiaryDto } from "./dto/diary.dto";
import { Request } from "express";
import { DiaryResponseDto } from "./dto/diary-res.dto";
import { SaveFolderTreeResDto } from "./dto/diaryFolder.dto";
@ApiTags("다이어리")
@Controller("diary")
export class DiaryController {
  constructor(private readonly diaryService: DiaryService) {}

  // 폴더 구조 생성
  @Patch("saveTree")
  @ApiOperation({ summary: "사용자의 폴더 트리 저장" })
  @ApiResponse({
    status: 200,
    description: "사용자의 폴더 트리가 저장되었습니다.",
    type: SaveFolderTreeResDto,
  })
  @UseGuards(AuthGuard("jwt"))
  async saveFolderTree(
    @Body("folders") folders: SaveDiaryFolderDto[],
    @Req() req: Request
  ) {
    const userId = req.user["id"];

    const result = await this.diaryService.saveFolderTree(folders, userId);

    return {
      success: true,
      message: result.message,
    };
  }

  // 폴더 조회
  @Get("folderList")
  @ApiOperation({ summary: "사용자의 폴더 트리 조회" })
  @ApiResponse({ status: 200, type: [DiaryFolderResDto] })
  @ApiQuery({
    name: "userId",
    required: true,
    type: Number,
    description: "조회할 유저 ID",
  })
  async getFolderTree(
    @Query("userId", ParseIntPipe) userId: number
  ): Promise<DiaryFolderResDto[]> {
    const folders = await this.diaryService.getFolder(userId);
    return folders.map((folder) => ({
      id: folder.id,
      title: folder.title,
      is_deleted: folder.is_deleted,
      parentId: folder.parent?.id || null,
      children:
        folder.children?.map((child) => ({
          id: child.id,
          title: child.title,
          is_deleted: child.is_deleted,
          parentId: child.parent?.id || null,
          children: [],
        })) || [],
    }));
  }

  // 다이어리 저장
  @Post("save")
  @UseGuards(AuthGuard("jwt"))
  @ApiOperation({ summary: "다이어리 저장" })
  @ApiResponse({
    status: 201,
    description: "다이어리가 저장되었습니다.",
    type: DiaryResponseDto,
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
    type: [DiaryResponseDto],
  })
  @ApiParam({ name: "hostId", description: "조회할 유저 ID" })
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
  @ApiParam({ name: "hostId", description: "조회할 유저 ID" })
  async getPhotosForLogoutUser(
    @Param("hostId", ParseIntPipe) hostId: number
  ): Promise<Diary[]> {
    return await this.diaryService.getDiaryByLogout(hostId);
  }

  // 수정
  @Patch(":diaryId")
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  @ApiOperation({ summary: "다이어리 수정" })
  @ApiResponse({ status: 200, type: Diary })
  @ApiParam({ name: "diaryId", description: "수정할 다이어리 ID" })
  async updateDiary(
    @Param("diaryId", ParseIntPipe) diaryId: number,
    @Body() dto: SaveDiaryDto,
    @Req() req: Request
  ) {
    const userId = req.user["id"];
    return await this.diaryService.updateDiary(userId, diaryId, dto);
  }

  // 삭제
  @Delete(":diaryId")
  @UseGuards(AuthGuard("jwt"))
  @ApiOperation({ summary: "사진 삭제" })
  @ApiResponse({
    status: 200,
    description: "삭제 완료",
    type: DeleteDiaryResponseDto,
  })
  @ApiParam({ name: "diaryId", description: "삭제할 다이어리 ID" })
  async deletePhoto(
    @Param("diaryId", ParseIntPipe) diaryId: number,
    @Req() req: Request
  ): Promise<DeleteDiaryResponseDto> {
    const userId = req.user["id"];
    return await this.diaryService.deletePost(userId, diaryId);
  }
}
