import { ApiProperty } from "@nestjs/swagger";

export class CreateResPaymentDto {
  @ApiProperty({ example: 12, description: "결제 고유 ID" })
  id: number;

  @ApiProperty({
    example: 1,
    description: "유저 ID",
  })
  userId: number;

  @ApiProperty({
    example: "홍길동",
    description: "유저 이름",
  })
  userName: string;

  @ApiProperty({
    example: 10,
    description: "결제한 도토리 개수",
  })
  dotori_amount: number;

  @ApiProperty({
    example: 1000,
    description: "결제 금액 (원)",
  })
  amount: number;

  @ApiProperty({
    example: "order-1716612345678-123",
    description: "주문 ID",
  })
  order_id: string;

  @ApiProperty({
    example: "tpv_abc123xyz",
    description: "Toss 결제 ID",
  })
  toss_payment_id: string;

  @ApiProperty({
    example: "2025-05-25T12:34:56.000Z",
    description: "결제 일시 (ISO 8601)",
  })
  created_at: string;
}
