import { Module } from '@nestjs/common';
import { MinimiitemsService } from './minimiitems.service';
import { MinimiitemsController } from './minimiitems.controller';

@Module({
  providers: [MinimiitemsService],
  controllers: [MinimiitemsController]
})
export class MinimiitemsModule {}
