import { Module } from '@nestjs/common';
import { MiniroomitemsService } from './miniroomitems.service';
import { MiniroomitemsController } from './miniroomitems.controller';

@Module({
  providers: [MiniroomitemsService],
  controllers: [MiniroomitemsController]
})
export class MiniroomitemsModule {}
