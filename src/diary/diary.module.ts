import { forwardRef, Module } from "@nestjs/common";
import { DiaryService } from "./diary.service";
import { DiaryController } from "./diary.controller";
import { Diary } from "./diary.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DiaryCommentsModule } from "src/diary_comments/diary_comments.module";
import { DiaryFolder } from "./diaryFolder.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Diary, DiaryFolder]),
    forwardRef(() => DiaryCommentsModule),
  ],
  providers: [DiaryService],
  controllers: [DiaryController],
  exports: [DiaryService],
})
export class DiaryModule {}
