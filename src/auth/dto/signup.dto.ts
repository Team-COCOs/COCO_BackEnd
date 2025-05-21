import { ApiProperty } from "@nestjs/swagger";
import { Gender } from "../../users/users.entity";

export class SignUpDto {
  @ApiProperty({ example: "user@example.com" })
  email: string;

  @ApiProperty({ example: "password123!" })
  password: string;

  @ApiProperty({ example: "홍길동" })
  name: string;

  @ApiProperty({ example: "010-1234-5678" })
  phone: string;

  @ApiProperty({ example: Gender.MAN, enum: Gender })
  gender: Gender;

  @ApiProperty({ example: "1990-01-01" })
  birthday: string;
}
