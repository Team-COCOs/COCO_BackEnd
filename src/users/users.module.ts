import { forwardRef, Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./users.entity";
import { AuthModule } from "../auth/auth.module";
import { PhotosModule } from "src/photos/photos.module";
import { DiaryModule } from "src/diary/diary.module";
import { FriendsModule } from "src/friends/friends.module";
import { VisitModule } from "src/visit/visit.module";
import { MinihomepisModule } from "src/minihomepis/minihomepis.module";
import { UseritemsModule } from "src/useritems/useritems.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => UseritemsModule),
    forwardRef(() => AuthModule),
    forwardRef(() => PhotosModule),
    forwardRef(() => DiaryModule),
    forwardRef(() => FriendsModule),
    forwardRef(() => VisitModule),
    forwardRef(() => MinihomepisModule),
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
