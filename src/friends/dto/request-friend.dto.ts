import { ApiProperty } from "@nestjs/swagger";

export class RequestFriendDto {
  @ApiProperty({ example: 5, description: "수신자(상대방) 유저 ID" })
  receiverId: number;

  @ApiProperty({ example: "현이", description: "내가 상대를 부르는 이름" })
  requester_name: string;

  @ApiProperty({ example: "민쥬", description: "상대가 나를 부르는 이름" })
  receiver_name: string;

  @ApiProperty({
    example: "오랜만이야! 친구하자~",
    description: "일촌 신청 메시지",
  })
  message: string;
}
