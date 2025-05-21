import { ApiProperty } from "@nestjs/swagger";

export class FindIdRequestDto {
  @ApiProperty({ example: "홍길동" })
  name: string;

  @ApiProperty({ example: "010-1234-5678" })
  phone: string;
}
