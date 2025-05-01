import { StoreItemType } from "../storeitems.entity";
import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
export class CreateStoreItemDto {
  @ApiProperty({ example: "핑크 미니홈피 배경", description: "상품 이름" })
  name: string;

  @ApiProperty({
    example: "https://cdn.example.com/images/skin1.png",
    description: "아이템 미리보기 이미지 URL",
  })
  file: string;

  @ApiProperty({ example: 10, description: "가격 (도토리)" })
  price: number;

  @ApiProperty({
    example: "minimi",
    enum: StoreItemType,
    description: "아이템 타입",
  })
  category: StoreItemType;

  @ApiPropertyOptional({
    example: "아이유",
    description: "아티스트 이름 (쥬크박스용)",
  })
  artist?: string;

  @ApiPropertyOptional({
    example: 183,
    description: "재생 시간 (초, 쥬크박스용)",
  })
  duration?: number;
}

export class UpdateStoreItemDto extends PartialType(CreateStoreItemDto) {}
