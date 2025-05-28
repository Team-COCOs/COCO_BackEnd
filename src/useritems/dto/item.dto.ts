import { ApiProperty } from "@nestjs/swagger";

export class ItemInfoDto {
  @ApiProperty({ example: 1, nullable: true })
  id: number | null;

  @ApiProperty({ example: "/uploads/image.png", nullable: true })
  file: string | null;

  @ApiProperty({ example: "minimi", nullable: true })
  category: string | null;

  @ApiProperty({ example: "귀여운 미니미", nullable: true })
  name: string | null;
}
