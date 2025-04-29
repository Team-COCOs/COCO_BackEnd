import { Module } from '@nestjs/common';
import { MinihomepisService } from './minihomepis.service';
import { MinihomepisController } from './minihomepis.controller';

@Module({
  providers: [MinihomepisService],
  controllers: [MinihomepisController]
})
export class MinihomepisModule {}
