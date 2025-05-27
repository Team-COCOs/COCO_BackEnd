import { ApiProperty } from "@nestjs/swagger";
import { VisibilityStatus } from "../guestbooks.entity";

export class GuestbookToggleMessageDto {
  @ApiProperty({ example: "방명록이 공개로 설정되었습니다." })
  message: string;

  @ApiProperty({ enum: VisibilityStatus })
  status: VisibilityStatus;
}

export class GuestbookDeleteMessageDto {
  @ApiProperty({ example: "방명록이 삭제되었습니다." })
  message: string;
}
