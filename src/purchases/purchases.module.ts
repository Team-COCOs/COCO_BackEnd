import { Module } from "@nestjs/common";
import { PurchasesService } from "./purchases.service";
import { PurchasesController } from "./purchases.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Purchase } from "./purchases.entity";
import { UsersModule } from "src/users/users.module";
import { UseritemsModule } from "src/useritems/useritems.module";
import { StoreitemsModule } from "src/storeitems/storeitems.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Purchase]),
    UsersModule,
    UseritemsModule,
    StoreitemsModule,
  ],
  providers: [PurchasesService],
  controllers: [PurchasesController],
})
export class PurchasesModule {}
