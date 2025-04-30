import { Module } from "@nestjs/common";
import { DiaryService } from "src/diary/diary.service";
import { DiaryController } from "src/diary/diary.controller";

@Module({
  providers: [DiaryService],
  controllers: [DiaryController],
})
export class SkinModule {}
