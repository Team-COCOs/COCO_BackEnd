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
  @ApiProperty()
  id: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  friend: string;

  @ApiProperty()
  profile_image: string;

  @ApiProperty()
  myNaming: string;

  @ApiProperty()
  theirNaming: string;

  @ApiProperty()
  friend_gender: string;

  @ApiProperty()
  since: string;
}

export class NewFriendDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  requesterId: number;

  @ApiProperty()
  requester: string;

  @ApiProperty()
  receiver: string;

  @ApiProperty()
  requester_name: string;

  @ApiProperty()
  requester_gender: string;

  @ApiProperty()
  receiver_name: string;

  @ApiProperty()
  message: string;

  @ApiProperty()
  profileImg: string;

  @ApiProperty()
  receivedAt: string;
}
