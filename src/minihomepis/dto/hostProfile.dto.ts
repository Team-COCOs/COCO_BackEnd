import { ApiProperty } from "@nestjs/swagger";
import { Gender, UserRole } from "../../users/users.entity";

export class UserProfileDto {
  @ApiProperty({ example: 1, description: "유저 고유 ID" })
  id: number;

  @ApiProperty({ example: "foo@bar.com", description: "이메일" })
  email: string;

  @ApiProperty({ example: "홍길동", description: "이름" })
  name: string | null;

  @ApiProperty({ example: "010-1234-5678", description: "전화번호" })
  phone: string | null;

  @ApiProperty({ example: Gender.MAN, description: "성별" })
  gender: Gender | null;

  @ApiProperty({
    example: "/avatarImg/default.png",
    description: "프로필 이미지 URL",
  })
  profile_image: string;

  @ApiProperty({ example: UserRole.USER, description: "유저 역할" })
  role: UserRole;

  @ApiProperty({ example: 42, description: "도토리 개수" })
  dotoris: number;

  @ApiProperty({ example: "1990-05-14", description: "생일" })
  birthday: string | null;
}
