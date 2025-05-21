import { ApiProperty } from "@nestjs/swagger";
import { Gender, UserRole } from "../../users/users.entity";

export class LoginRequestDto {
  @ApiProperty({ example: "user@example.com" })
  email: string;

  @ApiProperty({ example: "password123!" })
  password: string;
}

export class LoginResponseDto {
  id: number;
  email: string;
  name: string | null;
  phone: string | null;
  gender: Gender | null;
  profile_image: string;
  role: UserRole;
  dotoris: number;
  birthday: string | null;
  access_token: string;
  refresh_token: string;
}
