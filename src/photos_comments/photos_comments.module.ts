import { Module } from "@nestjs/common";
import { PhotosCommentsService } from "./photos_comments.service";
import { PhotosCommentsController } from "./photos_comments.controller";

@Module({
  providers: [PhotosCommentsService],
  controllers: [PhotosCommentsController],
})
export class PhotosCommentsModule {}
