import { Module } from '@nestjs/common';
import { StoreitemsService } from './storeitems.service';
import { StoreitemsController } from './storeitems.controller';

@Module({
  providers: [StoreitemsService],
  controllers: [StoreitemsController]
})
export class StoreitemsModule {}
