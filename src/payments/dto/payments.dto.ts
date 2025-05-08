export class CreatePaymentDto {
  dotori: number;
  tossPaymentId: string;
}

export class WebhookDto {
  orderId: string;
  tossPaymentId: string;
}
