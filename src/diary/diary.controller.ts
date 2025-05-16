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

  // // 사진 저장
  // @Post("save")
  // @UseGuards(AuthGuard("jwt"))
  // @UseInterceptors(
  //   FileInterceptor("photo", {
  //     storage: diskStorage({
  //       destination: "./uploads",
  //       filename: (req, file, cb) => {
  //         const uniqueSuffix =
  //           Date.now() + "-" + Math.round(Math.random() * 1e9);
  //         const ext = extname(file.originalname);
  //         cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  //       },
  //     }),
  //   })
  // )
  // @ApiConsumes("multipart/form-data")
  // @ApiOperation({ summary: "사진 저장" })
  // @ApiResponse({
  //   status: 201,
  //   description: "사진이 저장되었습니다.",
  //   type: Photo,
  // })
  // async savePhoto(
  //   @Body() dto: SavePhotoDto,
  //   @UploadedFile() file: Express.Multer.File,
  //   @Req() req: Request
  // ): Promise<Photo> {
  //   const userId = req.user["id"];

  //   if (file) {
  //     dto.photo_url = `/uploads/${file.filename}`;
  //   }

  //   return await this.photosService.savePhoto(userId, dto);
  // }

  // // 사진 조회
  // @Get(":hostId")
  // @UseGuards(AuthGuard("jwt"))
  // @ApiOperation({ summary: "내 사진첩 목록 조회" })
  // @ApiResponse({
  //   status: 200,
  //   description: "사용자 사진 목록 반환",
  //   type: [Photo],
  // })
  // async getMyPhotos(
  //   @Param("hostId", ParseIntPipe) hostId: number,
  //   @Req() req: Request
  // ): Promise<Photo[]> {
  //   const viewerId = req.user["id"];
  //   return await this.photosService.getPhotosByUser(hostId, viewerId);
  // }
}
