import { forwardRef, Module } from "@nestjs/common";
import { PurchasesService } from "./purchases.service";
import { PurchasesController } from "./purchases.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Purchase } from "./purchases.entity";
import { UsersModule } from "src/users/users.module";
import { UseritemsModule } from "src/useritems/useritems.module";
import { StoreitemsModule } from "src/storeitems/storeitems.module";
import { MiniroomsModule } from "src/minirooms/minirooms.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Purchase]),
    forwardRef(() => UseritemsModule),
    forwardRef(() => StoreitemsModule),
    forwardRef(() => UsersModule),
    forwardRef(() => MiniroomsModule),
  ],
  providers: [PurchasesService],
  controllers: [PurchasesController],
  exports: [PurchasesService],
})
export class PurchasesModule {}
