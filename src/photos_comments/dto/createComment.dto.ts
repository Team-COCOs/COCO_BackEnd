import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsOptional, IsNumber } from "class-validator";

export class CreateCommentDto {
  @ApiProperty({ description: "댓글 내용" })
  @IsString()
  @IsNotEmpty()
  comment: string;

  @ApiPropertyOptional({ description: "대댓글일 경우 부모 댓글 ID" })
  @IsOptional()
  @IsNumber()
  parentId?: number;
}
