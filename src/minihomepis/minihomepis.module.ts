import { Module } from "@nestjs/common";
import { MinihomepisService } from "./minihomepis.service";
import { MinihomepisController } from "./minihomepis.controller";
import { Minihomepi } from "./minihomepis.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([Minihomepi])],
  providers: [MinihomepisService],
  controllers: [MinihomepisController],
})
export class MinihomepisModule {}
