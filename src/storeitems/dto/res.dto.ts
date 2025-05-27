import { ApiProperty } from "@nestjs/swagger";
import { StoreItemType } from "../storeitems.entity";

export class StoreItemResDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: "좋은 날" })
  name: string;

  @ApiProperty({ example: 30 })
  price: number;

  @ApiProperty({ enum: StoreItemType, example: StoreItemType.BGM })
  category: StoreItemType;

  @ApiProperty({ example: "아이유", required: false })
  artist?: string;

  @ApiProperty({ example: 180, required: false })
  duration?: number;

  @ApiProperty({ example: "/uploads/goodDay.mp3", required: false })
  full_url?: string;

  @ApiProperty({ example: "/uploads/goodDay_preview.mp3", required: false })
  preview_url?: string;
}
