import { ApiProperty } from "@nestjs/swagger";

export class ManagementResDto {
  @ApiProperty({ example: "오늘 하루도 행복하세요~" })
  content: string;
}
