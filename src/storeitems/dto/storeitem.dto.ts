import { StoreItemType } from "../storeitems.entity";
import { ApiProperty, PartialType } from "@nestjs/swagger";
export class CreateStoreItemDto {
  @ApiProperty({ example: "핑크 미니홈피 배경", description: "상품 이름" })
  name: string;

  @ApiProperty({
    example: "https://cdn.example.com/images/skin1.png",
    description: "아이템 미리보기 이미지 URL",
  })
  image_url: string;

  @ApiProperty({ example: 10, description: "가격 (도토리)" })
  price: number;

  @ApiProperty({
    example: "minimi",
    enum: StoreItemType,
    description: "아이템 타입",
  })
  type: StoreItemType;
}

export class UpdateStoreItemDto extends PartialType(CreateStoreItemDto) {}
