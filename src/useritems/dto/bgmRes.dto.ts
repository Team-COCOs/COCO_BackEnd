import { ApiProperty } from "@nestjs/swagger";

export class BgmResDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: "/uploads/music.mp3" })
  file: string;

  @ApiProperty({ example: "Love Song" })
  name: string;

  @ApiProperty({ example: "SG워너비" })
  artist: string;
}
