// users/dto/user-id-name.dto.ts
import { ApiProperty } from "@nestjs/swagger";

export class UserIdNameDto {
  @ApiProperty({ example: 1, description: "유저 ID" })
  id: number;

  @ApiProperty({ example: "홍길동", description: "유저 이름" })
  name: string;
}
