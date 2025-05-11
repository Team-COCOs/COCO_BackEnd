import { Module } from "@nestjs/common";
import { MiniroomsService } from "./minirooms.service";
import { MiniroomsController } from "./minirooms.controller";
import { SpeechBubble } from "./speechBubble.entity";
import { MiniRoom } from "./minirooms.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Minimi } from "./minimi.entity";

@Module({
  imports: [TypeOrmModule.forFeature([SpeechBubble, MiniRoom, Minimi])],
  providers: [MiniroomsService],
  controllers: [MiniroomsController],
})
export class MiniroomsModule {}
