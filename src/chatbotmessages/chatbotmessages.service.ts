import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class ChatbotmessagesService {
  private readonly logger = new Logger(ChatbotmessagesService.name);

  handleBotpressMessage(payload: any) {
    this.logger.log(
      `📩 Botpress로부터 받은 메시지: ${JSON.stringify(payload)}`
    );
    return { ok: true };
  }
}
