import { ApiProperty } from "@nestjs/swagger";

export class FriendRequestDto {
  @ApiProperty({ example: 2, description: "상대방 유저 ID" })
  receiverId: number;

  @ApiProperty({ example: "민수", description: "내가 상대를 부르는 이름" })
  requester_name: string;

  @ApiProperty({ example: "철수", description: "상대가 나를 부르는 이름" })
  receiver_name: string;

  @ApiProperty({ example: "우리 친하게 지내요!", description: "신청 메시지" })
  message: string;
}

export class FriendListDto {
  @ApiProperty({ example: 12, description: "일촌 관계 ID" })
  id: number;

  @ApiProperty({ example: 5, description: "상대방 유저 ID" })
  userId: number;

  @ApiProperty({ example: "홍길동", description: "상대방 이름" })
  friend: string;

  @ApiProperty({
    example: "/avatarImg/default.png",
    description: "상대방 프로필 이미지 URL",
  })
  profile_image: string;

  @ApiProperty({ example: "츄미", description: "내가 상대를 부르는 별명" })
  myNaming: string;

  @ApiProperty({ example: "달링", description: "상대가 나를 부르는 별명" })
  theirNaming: string;

  @ApiProperty({ example: "female", description: "상대방 성별" })
  friend_gender: string;

  @ApiProperty({ example: "2025-05-25 14:30", description: "일촌이 된 날짜" })
  since: string;
}

export class NewFriendDto {
  @ApiProperty({ example: 17, description: "일촌 요청 ID" })
  id: number;

  @ApiProperty({ example: 3, description: "요청자 유저 ID" })
  requesterId: number;

  @ApiProperty({ example: "현빈", description: "요청자 실명" })
  requester: string;

  @ApiProperty({ example: "수지", description: "수신자 실명" })
  receiver: string;

  @ApiProperty({
    example: "빈이",
    description: "요청자가 수신자를 부르는 이름",
  })
  requester_name: string;

  @ApiProperty({ example: "male", description: "요청자 성별" })
  requester_gender: string;

  @ApiProperty({
    example: "찌유",
    description: "수신자가 요청자를 부르는 이름",
  })
  receiver_name: string;

  @ApiProperty({ example: "같이 놀자~", description: "신청 메시지" })
  message: string;

  @ApiProperty({
    example: "/avatars/3.png",
    description: "요청자 프로필 이미지 URL",
  })
  profileImg: string;

  @ApiProperty({ example: "2025-05-25", description: "일촌 요청 받은 날짜" })
  receivedAt: string;
}
