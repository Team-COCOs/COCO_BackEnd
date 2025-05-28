import { ApiProperty } from "@nestjs/swagger";

export class UserItemDetailResDto {
  @ApiProperty({ example: 1, nullable: true })
  id: number | null;

  @ApiProperty({ example: "/uploads/skin.png", nullable: true })
  file: string | null;

  @ApiProperty({ example: "skin", nullable: true })
  category: string | null;

  @ApiProperty({ example: "우주 배경", nullable: true })
  name: string | null;
}
