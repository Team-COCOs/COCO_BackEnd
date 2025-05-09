import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Photo } from "./photos.entity";
import { PhotosCommentsModule } from "src/photos_comments/photos_comments.module";
import { PhotosService } from "./photos.service";
import { PhotosController } from "./photos.controller";
import { PhotoFolder } from "./photoFolder.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Photo, PhotoFolder]),
    forwardRef(() => PhotosCommentsModule),
  ],
  providers: [PhotosService],
  controllers: [PhotosController],
  exports: [PhotosService],
})
export class PhotosModule {}
