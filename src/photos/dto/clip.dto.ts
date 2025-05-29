import { ApiProperty } from "@nestjs/swagger";
import { VisibilityType } from "../photos.entity";

export class PhotoClipResDto {
  @ApiProperty({ example: 1, description: "사진 ID" })
  id: number;

  @ApiProperty({ example: "제목" })
  title: string;

  @ApiProperty({ example: "본문 내용" })
  content: string;

  @ApiProperty({ example: "/uploads/photo.jpg" })
  photo_url: string;

  @ApiProperty({ example: true })
  isScripted: boolean;

  @ApiProperty({ enum: VisibilityType, example: VisibilityType.PUBLIC })
  visibility: VisibilityType;

  @ApiProperty({ example: "스크랩 폴더" })
  folderName: string;

  @ApiProperty({ example: 99 })
  originAuthorId: number;

  @ApiProperty({ example: "원본 작성자 이름" })
  originAuthorName: string;

  @ApiProperty({ example: "2025-05-26 13:00" })
  created_at: string;
}
