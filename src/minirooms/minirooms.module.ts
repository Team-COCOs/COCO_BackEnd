import { forwardRef, Module } from "@nestjs/common";
import { MiniroomsService } from "./minirooms.service";
import { MiniroomsController } from "./minirooms.controller";
import { SpeechBubble } from "./speechBubble.entity";
import { MiniRoom } from "./minirooms.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Minimi } from "./minimi.entity";
import { UsersModule } from "src/users/users.module";
import { PurchasesModule } from "src/purchases/purchases.module";
import { StoreitemsModule } from "src/storeitems/storeitems.module";
import { UseritemsModule } from "src/useritems/useritems.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([SpeechBubble, MiniRoom, Minimi]),
    forwardRef(() => UsersModule),
    forwardRef(() => PurchasesModule),
    forwardRef(() => StoreitemsModule),
    forwardRef(() => UseritemsModule),
  ],
  providers: [MiniroomsService],
  controllers: [MiniroomsController],
  exports: [MiniroomsService],
})
export class MiniroomsModule {}
