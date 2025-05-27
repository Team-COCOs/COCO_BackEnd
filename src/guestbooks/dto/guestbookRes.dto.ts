import { ApiProperty } from "@nestjs/swagger";
import { VisibilityStatus } from "../guestbooks.entity";

class GuestbookCommentDto {
  @ApiProperty({ example: 1, description: "댓글 ID" })
  id: number;

  @ApiProperty({ example: "좋은 하루 되세요!", description: "댓글 내용" })
  content: string;

  @ApiProperty({ example: 5, description: "댓글 작성자 ID" })
  authorId: number;

  @ApiProperty({ example: "홍길동", description: "댓글 작성자 이름" })
  authorName: string;

  @ApiProperty({ example: "2025-05-25 15:30", description: "댓글 작성 시간" })
  created_at: string;
}

export class GuestbookResponseDto {
  @ApiProperty({ example: 1, description: "방명록 ID" })
  id: number;

  @ApiProperty({ example: 2, description: "작성자 ID" })
  authorId: number;

  @ApiProperty({ example: 3, description: "호스트 ID (미니홈피 주인)" })
  hostId: number;

  @ApiProperty({ example: "홍길동", description: "작성자 이름" })
  authorRealName: string;

  @ApiProperty({
    example: "/avatars/1.png",
    description: "작성자 프로필 이미지 URL",
  })
  authorProfile: string;

  @ApiProperty({ example: "female", description: "작성자 성별" })
  authorGender: string;

  @ApiProperty({ example: "주인공", description: "호스트 이름" })
  hostRealName: string;

  @ApiProperty({ example: "잘 지내시죠?", description: "방명록 내용" })
  content: string;

  @ApiProperty({
    enum: VisibilityStatus,
    example: VisibilityStatus.PUBLIC,
    description: "공개 여부",
  })
  status: VisibilityStatus;

  @ApiProperty({ example: "2025-05-25 14:23", description: "작성 시간" })
  created_at: string;

  @ApiProperty({ example: true, description: "본인이 작성한 글인지 여부" })
  isMine: boolean;

  @ApiProperty({
    type: [GuestbookCommentDto],
    description: "방명록에 달린 댓글 목록",
  })
  comments: GuestbookCommentDto[];
}
