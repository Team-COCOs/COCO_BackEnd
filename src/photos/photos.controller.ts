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
import { PhotosService } from "./photos.service";
import { SavePhotoFolderDto } from "./dto/photoFolder.dto";
import { AuthGuard } from "@nestjs/passport";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { PhotoFolder } from "./photoFolder.entity";
@Controller("photos")
export class PhotosController {
  constructor(private readonly photosService: PhotosService) {}

  // 폴더 생성
  @Post("saveTree")
  @UseGuards(AuthGuard("jwt"))
  async saveFolderTree(
    @Body("folders") folders: SavePhotoFolderDto[],
    @Req() req
  ) {
    const userId = req.user.id;

    const result = await this.photosService.saveFolderTree(folders, userId);

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
    type: [PhotoFolder],
  })
  async getFolderTree(
    @Query("userId", ParseIntPipe) userId: number
  ): Promise<PhotoFolder[]> {
    return await this.photosService.getFolder(userId);
  }
}
