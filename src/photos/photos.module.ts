import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Photo } from "./photos.entity";
import { PhotosCommentsModule } from "../photos_comments/photos_comments.module";
import { PhotosService } from "./photos.service";
import { PhotosController } from "./photos.controller";
import { PhotoFolder } from "./photoFolder.entity";
import { UsersModule } from "src/users/users.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Photo, PhotoFolder]),
    forwardRef(() => PhotosCommentsModule),
    forwardRef(() => UsersModule),
  ],
  providers: [PhotosService],
  controllers: [PhotosController],
  exports: [PhotosService],
})
export class PhotosModule {}
