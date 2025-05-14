import { ApiProperty } from "@nestjs/swagger";
import { VisibilityType } from "../photos.entity";

export class NewPhotoDto {
  @ApiProperty({ example: 123, description: "사진 게시물 고유 ID" })
  id: number;

  @ApiProperty({ example: "여행앨범", description: "폴더 이름" })
  folderName: string;

  @ApiProperty({ example: "https://…/photo.jpg", description: "사진 URL" })
  photoUrl: string;

  @ApiProperty({ example: "제주도 바다", description: "사진 제목" })
  title: string;

  @ApiProperty({
    example: "맑은 날의 제주 바다 사진입니다.",
    description: "사진 본문 내용",
  })
  content: string;

  @ApiProperty({
    example: "2025-05-07 15:20",
    description: "작성 일시 (yyyy-MM-dd HH:mm 형식)",
  })
  created_at: string;

  @ApiProperty({ example: "photo", description: "항목 타입 (항상 'photo')" })
  type: "photo";
}

export class SavePhotoDto {
  @ApiProperty()
  photo_url: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  folderId?: number; // nullable

  @ApiProperty({ enum: VisibilityType, default: VisibilityType.PUBLIC })
  visibility: VisibilityType;
}
