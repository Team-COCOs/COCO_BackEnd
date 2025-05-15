import { ApiProperty } from "@nestjs/swagger";

export class CommentUserDto {
  @ApiProperty({ description: "작성자 ID" })
  id: number;

  @ApiProperty({ description: "작성자 이름" })
  name: string;
}

export class CommentResponseDto {
  @ApiProperty({ description: "댓글 ID" })
  id: number;

  @ApiProperty({ description: "댓글 내용" })
  content: string;

  @ApiProperty({ description: "댓글 생성 시간" })
  created_at: Date;

  @ApiProperty({ description: "게시글 ID" })
  postId: number;

  @ApiProperty({ description: "작성자 정보" })
  user: CommentUserDto;

  @ApiProperty({ description: "부모 댓글 ID (null 가능)" })
  parentCommentId: number | null;
}
