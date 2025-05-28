import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { StoreItemType } from "src/storeitems/storeitems.entity";

export class PurchaseStoreItemDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty({ nullable: true })
  artist: string | null;

  @ApiProperty({ enum: StoreItemType })
  category: StoreItemType;

  @ApiProperty()
  file: string;

  @ApiProperty()
  price: number;

  @ApiProperty({ nullable: true })
  duration: number | null;
}

export class PurchaseResDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  acquired_at: Date;

  @ApiProperty({ type: PurchaseStoreItemDto })
  @Type(() => PurchaseStoreItemDto)
  storeItems: PurchaseStoreItemDto;
}

export class StoreItemResDto {
  @ApiProperty({ example: 1, description: "스토어 아이템 ID" })
  id: number;

  @ApiProperty({ example: "봄날의 노래", description: "아이템 이름" })
  name: string;

  @ApiProperty({ example: "방탄소년단", description: "아티스트" })
  artist: string;

  @ApiProperty({
    example: StoreItemType.BGM,
    description: "아이템 카테고리 (배경, 미니미, BGM 등)",
    enum: StoreItemType,
  })
  category: StoreItemType;

  @ApiProperty({
    example: "/uploads/bgm/filename.mp3",
    description: "파일 경로",
  })
  file: string;

  @ApiProperty({ example: 20, description: "가격 (도토리)" })
  price: number;

  @ApiProperty({ example: 10, description: "재생 시간 (초)" })
  duration: number;
}
