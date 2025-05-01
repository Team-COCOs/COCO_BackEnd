import { ApiProperty } from "@nestjs/swagger";

export class CreateBgmDto {
  @ApiProperty({ example: "너의 모든 순간", description: "제목" })
  title: string;

  @ApiProperty({ example: "성시경", description: "아티스트" })
  artist: string;

  @ApiProperty({
    example: "https://cdn.example.com/preview.jpg",
    description: "썸네일/미리보기 URL",
  })
  url: string;

  @ApiProperty({
    example: "https://cdn.example.com/audio.mp3",
    description: "음원 파일 경로",
  })
  audio_file: string;

  @ApiProperty({ example: 185, description: "재생 시간 (초)" })
  duration: number;
}
