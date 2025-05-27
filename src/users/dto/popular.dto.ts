import { ApiProperty } from "@nestjs/swagger";

export class PopularUserDto {
  @ApiProperty({ example: 3, description: "유저 ID" })
  userId: number;

  @ApiProperty({ example: "홍길동", description: "유저 이름" })
  name: string;

  @ApiProperty({
    example: "/avatars/3.png",
    description: "유저의 프로필 이미지 경로",
  })
  profileImage: string;

  @ApiProperty({ example: 28, description: "오늘 방문자 수" })
  todayVisitCount: number;

  @ApiProperty({ example: 300, description: "총 방문자 수" })
  totalVisitCount: number;
}
