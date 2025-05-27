import { ApiProperty } from "@nestjs/swagger";

export class GuestbookCommentDeleteResponseDto {
  @ApiProperty({ example: true, description: "삭제 성공 여부" })
  ok: boolean;
}
