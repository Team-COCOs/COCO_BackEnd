import { Module } from '@nestjs/common';
import { FriendCommentsService } from './friend_comments.service';
import { FriendCommentsController } from './friend_comments.controller';

@Module({
  providers: [FriendCommentsService],
  controllers: [FriendCommentsController]
})
export class FriendCommentsModule {}
