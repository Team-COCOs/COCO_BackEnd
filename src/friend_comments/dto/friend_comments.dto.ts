import { ApiProperty } from "@nestjs/swagger";

export class FriendCommentDto {
  @ApiProperty({ example: 2, description: "일촌평을 받을 유저 ID" })
  hostId: number;

  @ApiProperty({ example: "좋은 친구야~", description: "일촌평 내용" })
  content: string;
}

export class FriendCommentResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  authorId: number;

  @ApiProperty()
  hostId: number;

  @ApiProperty()
  authorRealName: string;

  @ApiProperty()
  hostRealName: string;

  @ApiProperty()
  authorName: string;

  @ApiProperty()
  hostName: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  created_at: string;
}
