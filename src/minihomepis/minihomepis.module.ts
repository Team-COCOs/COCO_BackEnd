import { forwardRef, Module } from "@nestjs/common";
import { MinihomepisService } from "./minihomepis.service";
import { MinihomepisController } from "./minihomepis.controller";
import { Minihomepi } from "./minihomepis.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "src/users/users.module";
import { FriendsModule } from "src/friends/friends.module";
import { VisitModule } from "src/visit/visit.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Minihomepi]),
    forwardRef(() => UsersModule),
    forwardRef(() => FriendsModule),
    forwardRef(() => VisitModule),
  ],
  providers: [MinihomepisService],
  controllers: [MinihomepisController],
  exports: [MinihomepisService],
})
export class MinihomepisModule {}
