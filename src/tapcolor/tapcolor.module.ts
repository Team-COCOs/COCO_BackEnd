import { Module } from '@nestjs/common';
import { TapcolorService } from './tapcolor.service';
import { TapcolorController } from './tapcolor.controller';

@Module({
  providers: [TapcolorService],
  controllers: [TapcolorController]
})
export class TapcolorModule {}
