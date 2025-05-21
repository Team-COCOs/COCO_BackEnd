import { ApiProperty } from "@nestjs/swagger";

export class CheckDuplicateRequestDto {
  @ApiProperty({ example: "user@example.com", required: false })
  email?: string;

  @ApiProperty({ example: "010-1234-5678", required: false })
  phone?: string;
}
