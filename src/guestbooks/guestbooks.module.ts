import { forwardRef, Module } from "@nestjs/common";
import { GuestbooksService } from "./guestbooks.service";
import { GuestbooksController } from "./guestbooks.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Guestbook } from "./guestbooks.entity";
import { UsersModule } from "src/users/users.module";
import { FriendsModule } from "src/friends/friends.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Guestbook]),
    forwardRef(() => UsersModule),
  ],
  providers: [GuestbooksService],
  controllers: [GuestbooksController],
  exports: [GuestbooksService],
})
export class GuestbooksModule {}
