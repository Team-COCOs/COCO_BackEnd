import { ApiProperty } from "@nestjs/swagger";

export class MinimiResDto {
  @ApiProperty({ example: 1, nullable: true })
  id: number | null;

  @ApiProperty({ example: "/uploads/minimi.png", nullable: true })
  file: string | null;
}
