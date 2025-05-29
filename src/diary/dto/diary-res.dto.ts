import { ApiProperty } from "@nestjs/swagger";
import { VisibilityType } from "../diary.entity";

export class DiaryResponseDto {
  @ApiProperty({ example: 1, description: "다이어리 ID" })
  id: number;

  @ApiProperty({ example: "행복", description: "기분" })
  mood: string;

  @ApiProperty({ example: "맑음", description: "날씨" })
  weather: string;

  @ApiProperty({ example: "오늘 하루도 수고했어요.", description: "내용" })
  content: string;

  @ApiProperty({ enum: VisibilityType, description: "공개 범위" })
  visibility: VisibilityType;

  @ApiProperty({ example: 0, description: "조회수" })
  view_count: number;

  @ApiProperty({ example: "2025-05-29 12:34", description: "작성 시각" })
  created_at: string;

  @ApiProperty({ example: "2025-05-29 13:00", description: "수정 시각" })
  updated_at: string;
}
