import { ApiProperty } from "@nestjs/swagger";

export class GuestbookCommentResponseDto {
  @ApiProperty({ example: 1, description: "댓글 ID" })
  id: number;

  @ApiProperty({ example: "좋은 하루 되세요!", description: "댓글 내용" })
  content: string;

  @ApiProperty({
    example: "2025-05-27T10:00:00.000Z",
    description: "작성 시간",
  })
  created_at: Date;

  @ApiProperty({ example: 3, description: "연결된 방명록 ID" })
  guestbookId: number;

  @ApiProperty({ example: "홍길동", description: "작성자 이름" })
  authorName: string;
}
