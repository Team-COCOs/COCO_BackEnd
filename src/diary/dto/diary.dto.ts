import { ApiProperty } from "@nestjs/swagger";
import { VisibilityType } from "../diary.entity";

export class SaveDiaryDto {
  @ApiProperty({ example: "오늘은 맑음~", description: "일기 내용" })
  content: string;

  @ApiProperty({ example: "기분 최고!", description: "기분" })
  mood: string;

  @ApiProperty({ example: "sunny", description: "날씨" })
  weather: string;

  @ApiProperty({
    example: VisibilityType.PUBLIC,
    enum: VisibilityType,
    description: "공개 범위",
  })
  visibility: VisibilityType;

  @ApiProperty({ example: "새 폴더", description: "폴더 이름" })
  folder_name: string;
}

export class NewDiaryDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: "오늘은 맑음~" })
  content: string;

  @ApiProperty({ example: "기분 최고!" })
  mood: string;

  @ApiProperty({ example: "sunny" })
  weather: string;

  @ApiProperty({ example: "2025-05-21 10:24" })
  created_at: string;

  @ApiProperty({ example: "diary" })
  type: "diary";
}
