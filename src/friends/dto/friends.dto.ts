import { ApiProperty } from "@nestjs/swagger";

export class NewFriendDto {
  @ApiProperty({ example: 42, description: "친구 요청 레코드 ID" })
  id: number;

  @ApiProperty({ example: "김도현", description: "요청자 이름" })
  requester: string;

  @ApiProperty({
    example: "https://…/avatar.png",
    description: "요청자 프로필 이미지 URL",
  })
  profileImg: string;

  @ApiProperty({
    example: "2025-05-07 09:15",
    description: "요청 받은 일시 (yyyy-MM-dd HH:mm)",
  })
  receivedAt: string;
}

export class FriendListDto {
  @ApiProperty({ example: 42, description: "친구 관계 레코드 ID" })
  id: number;

  @ApiProperty({ example: 3, description: "친구 유저 ID" })
  userId: number;

  @ApiProperty({ example: "홍길동", description: "친구 이름" })
  name: string;

  @ApiProperty({
    example: "https://…/avatar.png",
    description: "친구 프로필 이미지 URL",
  })
  profile_image: string;

  @ApiProperty({
    example: "2025-05-01 14:22",
    description: "친구 맺은 일시 (yyyy-MM-dd HH:mm)",
  })
  since: string;
}
