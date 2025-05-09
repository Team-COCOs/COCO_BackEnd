import { ApiProperty } from "@nestjs/swagger";
import { Gender } from "../users.entity";

class FriendDto {
  @ApiProperty({ example: 3, description: "친구 ID" })
  userId: number;

  @ApiProperty({ example: "김민수", description: "친구 실명" })
  friend: string;

  @ApiProperty({ example: "베프", description: "내가 설정한 친구 별명" })
  myNaming: string;

  @ApiProperty({ example: "짱친", description: "상대가 설정한 나의 별명" })
  theirNaming: string;

  @ApiProperty({ example: "2025-05-08 14:30", description: "친구가 된 날짜" })
  since: string;
}

export class OtherProfileDto {
  @ApiProperty({ example: "홍길동", description: "이름" })
  name: string;

  @ApiProperty({ example: "user@example.com", description: "이메일" })
  email: string;

  @ApiProperty({ example: "man", enum: Gender, description: "성별" })
  gender: Gender;

  @ApiProperty({ type: [FriendDto], description: "친구 목록" })
  friends: FriendDto[];
}
