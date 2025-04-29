import { Module } from '@nestjs/common';
import { UseritemsService } from './useritems.service';
import { UseritemsController } from './useritems.controller';

@Module({
  providers: [UseritemsService],
  controllers: [UseritemsController]
})
export class UseritemsModule {}
