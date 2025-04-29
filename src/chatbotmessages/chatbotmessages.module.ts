import { Module } from '@nestjs/common';
import { ChatbotmessagesService } from './chatbotmessages.service';
import { ChatbotmessagesController } from './chatbotmessages.controller';

@Module({
  providers: [ChatbotmessagesService],
  controllers: [ChatbotmessagesController]
})
export class ChatbotmessagesModule {}
