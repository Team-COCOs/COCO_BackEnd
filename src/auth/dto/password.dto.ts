import { ApiProperty } from "@nestjs/swagger";

export class ResetPasswordDto {
  @ApiProperty({ example: "user@example.com" })
  email: string;

  @ApiProperty({ example: "010-1234-1234" })
  phone: string;

  @ApiProperty({ example: "newpassword123!" })
  newPassword: string;
}
