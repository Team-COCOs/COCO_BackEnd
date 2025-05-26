import { ApiProperty } from "@nestjs/swagger";

export class RecentPhotoTitleDto {
  @ApiProperty({ description: "사진 제목" })
  title: string;

  @ApiProperty({ description: "스크랩 여부" })
  isScripted: boolean;
}
