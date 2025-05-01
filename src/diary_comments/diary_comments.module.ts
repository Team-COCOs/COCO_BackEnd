import { forwardRef, Module } from "@nestjs/common";
import { DiaryCommentsService } from "./diary_comments.service";
import { DiaryCommentsController } from "./diary_comments.controller";
import { DiaryComment } from "./diary_comments.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DiaryModule } from "src/diary/diary.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([DiaryComment]),
    forwardRef(() => DiaryModule),
  ],
  providers: [DiaryCommentsService],
  controllers: [DiaryCommentsController],
  exports: [DiaryCommentsService],
})
export class DiaryCommentsModule {}
