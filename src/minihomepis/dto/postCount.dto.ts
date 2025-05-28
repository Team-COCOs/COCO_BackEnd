import { ApiProperty } from "@nestjs/swagger";

export class PostCountDto {
  @ApiProperty({ example: 1 })
  photoCount: number;

  @ApiProperty({ example: 5 })
  photoTotalCount: number;

  @ApiProperty({ example: 2 })
  diaryCount: number;

  @ApiProperty({ example: 10 })
  diaryTotalCount: number;

  @ApiProperty({ example: 0 })
  guestBookCount: number;

  @ApiProperty({ example: 8 })
  guestBookTotalCount: number;

  @ApiProperty({ example: 1 })
  cocoCount: number;

  @ApiProperty({ example: 1 })
  cocoTotalCount: number;
}
