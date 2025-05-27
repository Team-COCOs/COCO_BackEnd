import { ApiProperty } from "@nestjs/swagger";
import { VisibilityStatus } from "../guestbooks.entity";

export class CreateGuestbookDto {
  @ApiProperty({ example: 3, description: "미니홈피 주인의 ID" })
  miniUserId: number;

  @ApiProperty({
    example: "안녕하세요~ 잘 지내시죠?",
    description: "방명록 내용",
  })
  content: string;

  @ApiProperty({
    enum: VisibilityStatus,
    example: VisibilityStatus.PUBLIC,
    description: "공개 여부 (public 또는 private)",
  })
  status: VisibilityStatus;
}
