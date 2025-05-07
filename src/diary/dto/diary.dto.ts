import { ApiProperty } from "@nestjs/swagger";

export class NewDiaryDto {
  @ApiProperty({ example: 1, description: "다이어리 고유 ID" })
  id: number;

  @ApiProperty({ example: "오늘의 일기", description: "다이어리 제목" })
  title: string;

  @ApiProperty({ example: "React 공부 완료!", description: "다이어리 내용" })
  content: string;

  @ApiProperty({
    example: "2025-05-07 10:30",
    description: "작성 일시 (yyyy-MM-dd HH:mm)",
  })
  createdAt: string;

  @ApiProperty({ example: "diary", description: "항목 타입 (항상 'diary')" })
  type: "diary";
}
