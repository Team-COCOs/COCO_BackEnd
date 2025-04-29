import { Module } from '@nestjs/common';
import { GuestbooksService } from './guestbooks.service';
import { GuestbooksController } from './guestbooks.controller';

@Module({
  providers: [GuestbooksService],
  controllers: [GuestbooksController]
})
export class GuestbooksModule {}
