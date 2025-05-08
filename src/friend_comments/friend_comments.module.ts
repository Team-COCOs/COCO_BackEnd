import { Module } from "@nestjs/common";
import { FriendCommentsService } from "./friend_comments.service";
import { FriendCommentsController } from "./friend_comments.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FriendComment } from "./friend_comments.entity";
import { UsersModule } from "src/users/users.module";
import { FriendsModule } from "src/friends/friends.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([FriendComment]),
    UsersModule,
    FriendsModule,
  ],
  providers: [FriendCommentsService],
  controllers: [FriendCommentsController],
})
export class FriendCommentsModule {}
