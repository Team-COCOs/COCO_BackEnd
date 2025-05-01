import { Module } from '@nestjs/common';
import { PostsCommentsService } from './posts_comments.service';
import { PostsCommentsController } from './posts_comments.controller';

@Module({
  providers: [PostsCommentsService],
  controllers: [PostsCommentsController]
})
export class PostCommentsModule {}
