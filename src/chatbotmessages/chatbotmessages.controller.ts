import { Controller, Post, Body, Logger } from "@nestjs/common";

@Controller("chatbotmessages")
export class ChatbotmessagesController {
  private readonly logger = new Logger(ChatbotmessagesController.name);

  @Post("webhook")
  async handleWebhook(@Body() body: any) {
    this.logger.log(`📩 Botpress로부터 받은 메시지: ${JSON.stringify(body)}`);

    if (!body.type) {
      return { error: 'Missing "type" field in request body' };
    }

    return { status: "ok" };
  }
}
