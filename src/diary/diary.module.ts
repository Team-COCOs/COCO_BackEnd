import { forwardRef, Module } from "@nestjs/common";
import { DiaryService } from "./diary.service";
import { DiaryController } from "./diary.controller";
import { Diary } from "./diary.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DiaryCommentsModule } from "src/diary_comments/diary_comments.module";
import { DiaryFolder } from "./diaryFolder.entity";
import { UsersModule } from "../users/users.module";
import { FriendsModule } from "src/friends/friends.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Diary, DiaryFolder]),
    forwardRef(() => DiaryCommentsModule),
    forwardRef(() => UsersModule),
    forwardRef(() => FriendsModule),
  ],
  providers: [DiaryService],
  controllers: [DiaryController],
  exports: [DiaryService],
})
export class DiaryModule {}
