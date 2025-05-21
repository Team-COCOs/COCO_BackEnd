import { ApiProperty } from "@nestjs/swagger";

export class ChangePasswordDto {
  @ApiProperty({ example: "newpassword123", description: "새 비밀번호" })
  password: string;
}
export class ChangePhoneDto {
  @ApiProperty({ example: "010-1234-5678", description: "새 전화번호" })
  phone: string;
}
