import { IsNumber } from "class-validator";

export class PurchaseItemDto {
  @IsNumber()
  storeItemId: number;
}
