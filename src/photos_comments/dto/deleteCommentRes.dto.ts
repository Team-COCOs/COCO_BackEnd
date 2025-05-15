import { ApiProperty } from "@nestjs/swagger";

export class DeleteCommentResponseDto {
  @ApiProperty({ description: "성공 여부" })
  ok: boolean;
}
