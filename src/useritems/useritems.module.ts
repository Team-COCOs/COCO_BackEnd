import { Module } from "@nestjs/common";
import { UseritemsService } from "./useritems.service";
import { UseritemsController } from "./useritems.controller";
import { UserItem } from "./useritems.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([UserItem])],
  providers: [UseritemsService],
  controllers: [UseritemsController],
})
export class UseritemsModule {}
