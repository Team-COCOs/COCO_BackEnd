import {
  Body,
  Controller,
  Get,
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
import { PhotosService } from "./photos.service";
import { SavePhotoFolderDto } from "./dto/photoFolder.dto";
import { AuthGuard } from "@nestjs/passport";
import { ApiConsumes, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { PhotoFolder } from "./photoFolder.entity";
import { SavePhotoDto } from "./dto/photos.dto";
import { Photo } from "./photos.entity";
import { Request } from "express";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";

@Controller("photos")
export class PhotosController {
  constructor(private readonly photosService: PhotosService) {}

  // 폴더 생성
  @Post("saveTree")
  @UseGuards(AuthGuard("jwt"))
  async saveFolderTree(
    @Body("folders") folders: SavePhotoFolderDto[],
    @Req() req: Request
  ) {
    const userId = req.user["id"];

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
  @UseInterceptors(
    FileInterceptor("photo", {
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
  @ApiOperation({ summary: "사진 저장" })
  @ApiResponse({
    status: 201,
    description: "사진이 저장되었습니다.",
    type: Photo,
  })
  async savePhoto(
    @Body() dto: SavePhotoDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request
  ): Promise<Photo> {
    const userId = req.user["id"];

    if (file) {
      dto.photo_url = `/uploads/${file.filename}`;
    }

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

  @Patch(":photoId/clip")
  @UseGuards(AuthGuard("jwt"))
  @ApiOperation({ summary: "사진 스크랩" })
  @ApiResponse({ status: 200, description: "스크랩 완료" })
  async clipPhoto(
    @Param("photoId") photoId: number,
    @Req() req: Request
  ): Promise<Photo> {
    const userId = req.user["id"];
    return await this.photosService.clipPhoto(userId, photoId);
  }

  @Get("logout/:hostId")
  @ApiOperation({ summary: "사진첩 조회 (비로그인 상태)" })
  @ApiResponse({
    status: 200,
    description: "공개 사진 리스트",
    type: [Photo],
  })
  async getPhotosForLogoutUser(
    @Param("hostId", ParseIntPipe) hostId: number
  ): Promise<Photo[]> {
    return await this.photosService.getPhotosByLogout(hostId);
  }
}
