import { ApiProperty } from "@nestjs/swagger";
import { VisibilityType } from "../diary.entity";

export class NewDiaryDto {
  @ApiProperty({ example: 1, description: "다이어리 고유 ID" })
  id: number;

  @ApiProperty({ example: "React 공부 완료!", description: "다이어리 내용" })
  content: string;

  @ApiProperty({ example: "행복", description: "기분" })
  mood: string;

  @ApiProperty({ example: "맑음", description: "날씨" })
  weather: string;

  @ApiProperty({
    example: "2025-05-07 10:30",
    description: "작성 일시 (yyyy-MM-dd HH:mm)",
  })
  created_at: string;

  @ApiProperty({ example: "diary", description: "항목 타입 (항상 'diary')" })
  type: "diary";
}

export class SaveDiaryDto {
  @ApiProperty({ example: "React 공부 완료!", description: "본문 내용" })
  content: string;

  @ApiProperty({ example: "행복", description: "기분" })
  mood: string;

  @ApiProperty({ example: "맑음", description: "날씨" })
  weather: string;

  @ApiProperty({ example: 1, description: "폴더명" })
  folder_name?: string;

  @ApiProperty({ example: true, description: "스크립트 여부" })
  isScripted: boolean;

  @ApiProperty({
    enum: VisibilityType,
    default: VisibilityType.PUBLIC,
    description: "공개 범위",
  })
  visibility: VisibilityType;
}
