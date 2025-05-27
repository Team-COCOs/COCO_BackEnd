import { ApiProperty } from "@nestjs/swagger";

export class CreatePaymentDto {
  @ApiProperty({ example: 10, description: "도토리 수량" })
  dotori: number;

  @ApiProperty({
    example: "tpv_abc123xyz",
    description: "Toss 결제 ID (toss에서 받은 ID)",
  })
  tossPaymentId: string;
}
