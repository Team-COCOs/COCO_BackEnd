import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { DiaryService } from "./diary.service";
import { AuthGuard } from "@nestjs/passport";
import { SaveDiaryFolderDto } from "./dto/diaryFolder.dto";

@Controller("diary")
export class DiaryController {
  constructor(private readonly diaryService: DiaryService) {}

  @Post("/saveTree")
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
      folders: result.folders,
    };
  }
}
