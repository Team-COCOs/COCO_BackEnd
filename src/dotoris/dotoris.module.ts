import { Module } from '@nestjs/common';
import { DotorisService } from './dotoris.service';
import { DotorisController } from './dotoris.controller';

@Module({
  providers: [DotorisService],
  controllers: [DotorisController]
})
export class DotorisModule {}
