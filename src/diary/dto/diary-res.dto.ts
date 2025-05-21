import { ApiProperty } from "@nestjs/swagger";
import { VisibilityType } from "../diary.entity";

export class DiaryResponseDto {
  @ApiProperty() id: number;
  @ApiProperty() content: string;
  @ApiProperty() title: string;
  @ApiProperty() mood: string;
  @ApiProperty() weather: string;
  @ApiProperty({ enum: VisibilityType }) visibility: VisibilityType;
  @ApiProperty() created_at: Date;
}
