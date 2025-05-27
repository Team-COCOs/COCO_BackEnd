import { ApiProperty } from "@nestjs/swagger";
import { NewFriendDto } from "../../friends/dto/friends.dto";
import { FriendListDto } from "../../friends/dto/friends.dto";

export class NewPostDto {
  @ApiProperty({ example: 42, description: "포스트 ID" })
  id: number;

  @ApiProperty({
    example: "diary",
    description: "포스트 타입 (diary | photo)",
    enum: ["diary", "photo"],
  })
  type: "diary" | "photo";

  @ApiProperty({
    example: "오늘 하루 일기",
    description: "포스트 제목 또는 사진 이름",
  })
  title: string;

  @ApiProperty({
    example: "2025-05-25 20:01",
    description: "작성일 (yyyy-MM-dd HH:mm)",
  })
  created_at: string;
}

export class MainProfileDto {
  @ApiProperty({ example: "홍길동", description: "유저 이름" })
  name: string;

  @ApiProperty({ example: 7, description: "오늘 방문자 수" })
  todayVisit: number;

  @ApiProperty({
    type: [NewPostDto],
    description: "새 다이어리 또는 사진 포스트",
  })
  newPost: NewPostDto[];

  @ApiProperty({ example: 3, description: "새 게시물 개수" })
  newPostCount: number;

  @ApiProperty({ type: [NewFriendDto], description: "받은 일촌 신청 목록" })
  friendRequest: NewFriendDto[];

  @ApiProperty({ example: 2, description: "일촌 신청 개수" })
  friendRequestCount: number;

  @ApiProperty({ example: "/avatars/user1.png", description: "프로필 이미지" })
  profile_image: string | null;

  @ApiProperty({ example: 95, description: "보유 도토리 개수" })
  dotoris: number;

  @ApiProperty({ type: [FriendListDto], description: "일촌 목록" })
  friends: FriendListDto[];
}
