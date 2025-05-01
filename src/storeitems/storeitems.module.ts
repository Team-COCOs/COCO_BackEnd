import { Module } from "@nestjs/common";
import { StoreitemsService } from "./storeitems.service";
import { StoreitemsController } from "./storeitems.controller";
import { StoreItem } from "./storeitems.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([StoreItem])],
  providers: [StoreitemsService],
  controllers: [StoreitemsController],
})
export class StoreitemsModule {}
