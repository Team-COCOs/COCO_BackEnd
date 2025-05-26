import { ApiProperty } from "@nestjs/swagger";

export class AcceptRejectDto {
  @ApiProperty({ example: 5, description: "요청자 유저 ID" })
  requesterId: number;
}
