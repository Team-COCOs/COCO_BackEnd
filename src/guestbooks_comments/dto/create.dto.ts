import { ApiProperty } from "@nestjs/swagger";

export class CreateGuestbookCommentDto {
  @ApiProperty({
    example: "좋은 하루 되세요!",
    description: "댓글 내용",
  })
  content: string;
}
