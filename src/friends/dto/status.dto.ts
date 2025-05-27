import { ApiProperty } from "@nestjs/swagger";

export class FriendStatusDto {
  @ApiProperty({
    example: true,
    description: "서로 일촌 관계인지 여부",
  })
  areFriends: boolean;

  @ApiProperty({
    example: true,
    description: "내가 상대에게 일촌 신청을 보냈는지 여부",
  })
  requested: boolean;

  @ApiProperty({
    example: false,
    description: "상대가 나에게 일촌 신청을 보냈는지 여부",
  })
  received: boolean;
}
