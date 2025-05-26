import { ApiProperty } from "@nestjs/swagger";
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
  storeItems: PurchaseStoreItemDto;
}
