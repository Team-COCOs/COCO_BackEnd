import { Module } from '@nestjs/common';
import { SkinService } from './skin.service';
import { SkinController } from './skin.controller';

@Module({
  providers: [SkinService],
  controllers: [SkinController]
})
export class SkinModule {}
