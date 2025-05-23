import { forwardRef, Module } from "@nestjs/common";
import { UseritemsService } from "./useritems.service";
import { UseritemsController } from "./useritems.controller";
import { UserItem } from "./useritems.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PurchasesModule } from "src/purchases/purchases.module";
import { UsersModule } from "src/users/users.module";
import { MiniroomsModule } from "src/minirooms/minirooms.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([UserItem]),
    forwardRef(() => PurchasesModule),
    forwardRef(() => UsersModule),
    forwardRef(() => MiniroomsModule),
  ],
  providers: [UseritemsService],
  controllers: [UseritemsController],
  exports: [UseritemsService],
})
export class UseritemsModule {}
