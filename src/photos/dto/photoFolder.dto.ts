import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, IsOptional, IsInt } from "class-validator";

export class SavePhotoFolderDto {
  @ApiPropertyOptional({
    example: 5,
    description: "기존 폴더 ID (수정 시 필요, 신규 생성 시 생략)",
  })
  @IsOptional()
  @IsInt()
  id?: number;

  @ApiProperty({
    example: "abc123",
    description: "프론트에서 사용하는 key값 (임시 식별자)",
  })
  @IsString()
  key: string;

  @ApiProperty({
    example: "여행앨범",
    description: "폴더 제목",
  })
  @IsString()
  title: string;

  @ApiPropertyOptional({
    example: "parent123",
    description: "부모 폴더 key값 (루트 폴더일 경우 생략)",
  })
  @IsOptional()
  parent_id?: string;

  @ApiPropertyOptional({
    example: 7,
    description: "유저 ID (백엔드에서 주입됨)",
  })
  @IsOptional()
  user_id?: number;
}

export class SavePhotoFolderTreeResDto {
  @ApiProperty({ example: true, description: "저장 성공 여부" })
  success: boolean;

  @ApiProperty({ example: "폴더 트리 저장 완료", description: "메시지" })
  message: string;
}

export class PhotoFolderResDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: "여행앨범" })
  title: string;

  @ApiProperty({ example: false })
  is_deleted: boolean;

  @ApiProperty({ example: 0, nullable: true })
  parentId: number | null;

  @ApiProperty({ type: () => [PhotoFolderResDto], required: false })
  children?: PhotoFolderResDto[];
}
