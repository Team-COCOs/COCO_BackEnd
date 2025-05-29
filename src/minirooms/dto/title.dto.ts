import { ApiProperty } from "@nestjs/swagger";

export class MiniroomTitleDto {
  @ApiProperty({ example: "내 방", description: "미니룸 타이틀" })
  title: string | null;
}
