import { ApiProperty } from "@nestjs/swagger";

export class MiniroomBackgroundResDto {
  @ApiProperty({
    example: 42,
    description: "구매한 배경 아이템의 purchaseId 또는 기본 배경 ID",
  })
  purchaseId: number | string;

  @ApiProperty({
    example: "https://example.com/miniroom-background.png",
    description: "미니룸 배경 이미지 URL",
  })
  image: string;
}
