import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { PhotosService } from "./photos.service";
import { SavePhotoFolderDto } from "./dto/photoFolder.dto";
import { AuthGuard } from "@nestjs/passport";
@Controller("photos")
export class PhotosController {
  constructor(private readonly photosService: PhotosService) {}

  @Post("/saveTree")
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
      folders: result.folders,
    };
  }
}
