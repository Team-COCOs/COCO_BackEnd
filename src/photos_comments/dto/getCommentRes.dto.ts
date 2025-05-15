import { ApiProperty } from "@nestjs/swagger";
import { CommentResponseDto } from "./commentRes.dto";

export class GetCommentsResponseDto {
  @ApiProperty({ description: "성공 여부" })
  ok: boolean;

  @ApiProperty({ description: "게시글 ID" })
  postId: number;

  @ApiProperty({
    type: [CommentResponseDto],
    description: "댓글 리스트",
  })
  comments: CommentResponseDto[];
}
