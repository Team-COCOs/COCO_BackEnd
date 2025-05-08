import { forwardRef, Module } from "@nestjs/common";
import { FriendsService } from "./friends.service";
import { FriendsController } from "./friends.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Friend } from "./friends.entity";
import { UsersModule } from "../users/users.module";

@Module({
  imports: [TypeOrmModule.forFeature([Friend]), forwardRef(() => UsersModule)],
  providers: [FriendsService],
  controllers: [FriendsController],
  exports: [FriendsService],
})
export class FriendsModule {}
