import { Module } from "@nestjs/common";
import { DiaryCommentsService } from "./diary_comments.service";
import { DiaryCommentsController } from "./diary_comments.controller";

@Module({
  providers: [DiaryCommentsService],
  controllers: [DiaryCommentsController],
})
export class DiaryCommentsModule {}
