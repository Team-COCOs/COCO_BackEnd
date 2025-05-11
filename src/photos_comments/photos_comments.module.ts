import { forwardRef, Module } from "@nestjs/common";
import { PhotosCommentsService } from "./photos_comments.service";
import { PhotosCommentsController } from "./photos_comments.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PhotoComment } from "./photos_comments.entity";
import { PhotosModule } from "../photos/photos.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([PhotoComment]),
    forwardRef(() => PhotosModule),
  ],
  providers: [PhotosCommentsService],
  controllers: [PhotosCommentsController],
  exports: [PhotosCommentsService],
})
export class PhotosCommentsModule {}
