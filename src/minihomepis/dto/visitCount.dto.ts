import { ApiProperty } from "@nestjs/swagger";

export class VisitCountDto {
  @ApiProperty({ example: 3 })
  hostId: number;

  @ApiProperty({ example: 132 })
  total: number;

  @ApiProperty({ example: 7 })
  today: number;
}
