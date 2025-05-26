import { ApiProperty } from "@nestjs/swagger";

export class VisitAuthDto {
  @ApiProperty({
    example: 1,
    description: "방문하려는 미니홈피 주인의 유저 ID",
  })
  hostId: number;
}

export class VisitResponseDto {
  @ApiProperty({
    example: "방문 완료",
    description: "방문 처리 결과 메시지",
  })
  message: string;
}
