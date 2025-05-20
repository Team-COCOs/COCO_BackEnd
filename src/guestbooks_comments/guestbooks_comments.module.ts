import { Module } from "@nestjs/common";
import { GuestbooksCommentsService } from "./guestbooks_comments.service";
import { GuestbooksCommentsController } from "./guestbooks_comments.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GuestbookComment } from "./guestbooks.entity";

@Module({
  imports: [TypeOrmModule.forFeature([GuestbookComment])],
  providers: [GuestbooksCommentsService],
  controllers: [GuestbooksCommentsController],
})
export class GuestbooksCommentsModule {}
