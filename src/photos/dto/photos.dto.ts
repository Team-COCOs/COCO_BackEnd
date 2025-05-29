import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { VisibilityType } from "../photos.entity";
import {
  IsString,
  IsOptional,
  IsInt,
  IsBoolean,
  IsEnum,
} from "class-validator";

export class NewPhotoDto {
  @ApiProperty({ example: 123, description: "사진 게시물 고유 ID" })
  id: number;

  @ApiProperty({ example: "여행앨범", description: "폴더 이름" })
  folderName: string;

  @ApiProperty({ example: "https://…/photo.jpg", description: "사진 URL" })
  photoUrl: string;

  @ApiProperty({ example: "제주도 바다", description: "사진 제목" })
  title: string;

  @ApiProperty({ example: "ㅇㅇㅇ", description: "작성자" })
  author: string;

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
  @ApiProperty({ example: "https://…/photo.jpg", description: "사진 URL" })
  @IsString()
  photo_url: string;

  @ApiProperty({ example: "제주도 바다", description: "사진 제목" })
  @IsString()
  title: string;

  @ApiProperty({
    example: "맑은 날의 제주 바다 사진입니다.",
    description: "본문 내용",
  })
  @IsString()
  content: string;

  @ApiProperty({ example: "ㅇㅇㅇ", description: "작성자 이름" })
  @IsString()
  user: string;

  @ApiProperty({ example: "여행앨범", description: "폴더 이름" })
  @IsString()
  folder_name: string;

  @ApiProperty({ example: true, description: "스크랩 여부" })
  @IsBoolean()
  isScripted: boolean;

  @ApiProperty({
    enum: VisibilityType,
    default: VisibilityType.PUBLIC,
    description: "공개 범위",
  })
  @IsEnum(VisibilityType)
  visibility: VisibilityType;
}

export class SavePhotoFolderDto {
  @ApiPropertyOptional({ example: 12, description: "기존 폴더 ID" })
  @IsOptional()
  @IsInt()
  id?: number;

  @ApiProperty({ example: "abc123", description: "프론트에서 관리하는 key값" })
  @IsString()
  key: string;

  @ApiProperty({ example: "여행앨범", description: "폴더 제목" })
  @IsString()
  title: string;

  @ApiPropertyOptional({
    example: "xyz789",
    description: "부모 폴더 key (루트 폴더는 null)",
  })
  @IsOptional()
  @IsString()
  parent_id?: string;

  @ApiPropertyOptional({
    example: 7,
    description: "유저 ID (백엔드에서 주입됨)",
  })
  @IsOptional()
  @IsInt()
  user_id?: number;
}

export class SavePhotoResponseDto {
  @ApiProperty({ example: true, description: "성공 여부" })
  success: boolean;

  @ApiProperty({ example: "사진이 저장되었습니다", description: "결과 메시지" })
  message: string;

  @ApiProperty({ example: 123, description: "생성된 사진 ID" })
  photoId: number;
}

export class PhotoResDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: "https://.../photo.jpg" })
  photo_url: string;

  @ApiProperty({ example: "여행 사진" })
  title: string;

  @ApiProperty({ example: "제주도에서 찍은 사진이에요~" })
  content: string;

  @ApiProperty({ example: "public", enum: ["public", "private", "friends"] })
  visibility: string;

  @ApiProperty({ example: "2025-05-29 14:00" })
  created_at: string;

  @ApiProperty({ example: "true" })
  isScripted: boolean;

  @ApiProperty({ example: "여행앨범" })
  folderName: string;

  @ApiProperty({ example: "유민" })
  author: string;
}
