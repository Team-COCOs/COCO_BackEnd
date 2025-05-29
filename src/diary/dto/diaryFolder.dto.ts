import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, IsOptional, IsInt } from "class-validator";

export class SaveDiaryFolderDto {
  @ApiPropertyOptional({
    example: 12,
    description: "기존 폴더의 ID (신규 폴더일 경우 생략)",
  })
  @IsOptional()
  @IsInt()
  id?: number;

  @ApiProperty({
    example: "abc123",
    description: "프론트에서 관리하는 key값. 신규 폴더일 경우 ID 대신 사용",
  })
  @IsString()
  key: string;

  @ApiProperty({ example: "나의 기록", description: "폴더 제목" })
  @IsString()
  title: string;

  @ApiPropertyOptional({
    example: "xyz789",
    description: "부모 폴더의 key값 (루트 폴더면 생략)",
  })
  @IsOptional()
  parent_id?: string;

  @ApiPropertyOptional({
    example: 7,
    description: "폴더 소유 유저 ID (백엔드에서 주입되는 값)",
  })
  @IsOptional()
  user_id?: number;
}

export class SaveFolderTreeResDto {
  @ApiProperty({ example: true, description: "성공 여부" })
  success: boolean;

  @ApiProperty({ example: "폴더 트리 저장 완료", description: "메시지" })
  message: string;
}

export class DiaryFolderResDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: "내 폴더" })
  title: string;

  @ApiProperty({ example: false })
  is_deleted: boolean;

  @ApiProperty({ example: 0, nullable: true })
  parentId: number | null;

  @ApiProperty({ type: () => [DiaryFolderResDto], required: false })
  children?: DiaryFolderResDto[];
}
