import { ApiProperty } from "@nestjs/swagger";

export class SearchUserDto {
  @ApiProperty({ example: 1, description: "유저 고유 ID" })
  id: number;

  @ApiProperty({ example: "홍길동", description: "유저 이름" })
  name: string;

  @ApiProperty({
    example: "https://…/avatar.png",
    description: "프로필 이미지 URL",
  })
  profile_image: string;

  @ApiProperty({ example: "male", description: "성별" })
  gender: string;

  @ApiProperty({ example: "1990-05-14", description: "생년월일" })
  birthday: string;
}
