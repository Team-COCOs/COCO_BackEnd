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
}
