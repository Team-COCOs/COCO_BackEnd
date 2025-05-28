import { ApiProperty } from "@nestjs/swagger";

export class IdResDto {
  @ApiProperty({ example: 1, nullable: true })
  id: number | null;
}
