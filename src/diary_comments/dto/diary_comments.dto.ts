import { ApiProperty } from "@nestjs/swagger";

export class CreateCommentDto {
  @ApiProperty({
    example: "좋은 글 잘 봤어요!",
    description: "댓글 내용",
    maxLength: 500,
  })
  content: string;

  @ApiProperty({
    example: 1,
    description: "부모 댓글 ID",
    required: false,
    nullable: true,
  })
  parentCommentId?: number;
}

export class CommentResponseDto {
  @ApiProperty({ example: 1, description: "댓글 ID" })
  id: number;

  @ApiProperty({ example: "댓글 내용입니다.", description: "댓글 내용" })
  content: string;

  @ApiProperty({
    example: "2025-05-08T12:34:56.000Z",
    description: "작성 일시",
  })
  created_at: Date;

  @ApiProperty({ example: 5, description: "게시글 ID" })
  diaryId: number;

  @ApiProperty({ example: 2, description: "부모 댓글 ID", nullable: true })
  parentCommentId: number | null;
}

export class GetCommentsResponseDto {
  @ApiProperty({ example: true })
  ok: boolean;

  @ApiProperty({ example: 5 })
  postId: number;

  @ApiProperty({ type: [CommentResponseDto] })
  comments: CommentResponseDto[];
}

export class DeleteCommentResponseDto {
  @ApiProperty({ example: true })
  ok: boolean;
}
