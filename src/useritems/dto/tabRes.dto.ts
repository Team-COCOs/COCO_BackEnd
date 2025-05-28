import { ApiProperty } from "@nestjs/swagger";

export class TabsResDto {
  @ApiProperty({ example: ["diary", "visitor", "photo", "coco"] })
  tabs: string[];
}
