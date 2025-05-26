import { ApiProperty } from "@nestjs/swagger";

export class FriendCommentDto {
  @ApiProperty({ example: 2, description: "일촌평을 받을 유저 ID" })
  hostId: number;

  @ApiProperty({ example: "좋은 친구야~", description: "일촌평 내용" })
  content: string;
}

export class FriendCommentResponseDto {
  @ApiProperty({ example: 12, description: "일촌평 ID" })
  id: number;

  @ApiProperty({ example: 5, description: "작성자 유저 ID" })
  authorId: number;

  @ApiProperty({ example: 2, description: "받는 사람(호스트) 유저 ID" })
  hostId: number;

  @ApiProperty({ example: "김철수", description: "작성자 실제 이름" })
  authorRealName: string;

  @ApiProperty({ example: "김영희", description: "호스트 실제 이름" })
  hostRealName: string;

  @ApiProperty({
    example: "bestfriend",
    description: "작성자가 호스트를 부르는 별칭",
  })
  authorName: string;

  @ApiProperty({
    example: "buddy",
    description: "호스트가 작성자를 부르는 별칭",
  })
  hostName: string;

  @ApiProperty({ example: "좋은 친구야~", description: "일촌평 내용" })
  content: string;

  @ApiProperty({ example: "2025-05-25 14:32", description: "작성 일시 (KST)" })
  created_at: string;
}
