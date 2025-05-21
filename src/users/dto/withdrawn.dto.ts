import { ApiProperty } from "@nestjs/swagger";
import { UserRole } from "../users.entity";

export class WithdrawResponseDto {
  @ApiProperty({ example: "홍길동 (탈퇴)", description: "변경된 이름" })
  name: string;

  @ApiProperty({
    example: "withdrawn_1716283431234_foo@bar.com",
    description: "변경된 이메일",
  })
  email: string;

  @ApiProperty({ example: UserRole.WITHDRAWN, description: "변경된 역할" })
  role: UserRole;
}
