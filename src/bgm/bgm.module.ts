import { Module } from "@nestjs/common";
import { BgmService } from "./bgm.service";
import { BgmController } from "./bgm.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BGM } from "./bgm.entity";

@Module({
  imports: [TypeOrmModule.forFeature([BGM])],
  providers: [BgmService],
  controllers: [BgmController],
})
export class BgmModule {}
