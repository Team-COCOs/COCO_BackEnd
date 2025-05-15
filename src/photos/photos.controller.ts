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
import { SavePhotoDto } from "./dto/photos.dto";
import { Photo } from "./photos.entity";
import { Request } from "express";

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

  // 사진 저장
  @Post("save")
  @UseGuards(AuthGuard("jwt"))
  @ApiOperation({ summary: "사진 저장" })
  @ApiResponse({
    status: 201,
    description: "사진이 저장되었습니다.",
    type: Photo,
  })
  async savePhoto(@Body() dto: SavePhotoDto, @Req() req): Promise<Photo> {
    const userId = req.user.id;
    return await this.photosService.savePhoto(userId, dto);
  }

  // 사진 조회
  @Get(":hostId")
  @UseGuards(AuthGuard("jwt"))
  @ApiOperation({ summary: "내 사진첩 목록 조회" })
  @ApiResponse({
    status: 200,
    description: "사용자 사진 목록 반환",
    type: [Photo],
  })
  async getMyPhotos(
    @Param("hostId", ParseIntPipe) hostId: number,
    @Req() req: Request
  ): Promise<Photo[]> {
    const viewerId = req.user["id"];
    return await this.photosService.getPhotosByUser(hostId, viewerId);
  }
}
