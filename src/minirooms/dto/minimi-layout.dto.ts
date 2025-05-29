import {
  ApiProperty,
  ApiExtraModels,
  getSchemaPath,
  ApiPropertyOptional,
} from "@nestjs/swagger";

export class MinimiItemDto {
  @ApiProperty({
    example: "default-minimi",
    description: "기본 미니미 또는 구매한 미니미 ID",
  })
  id: number | "default-minimi";

  @ApiProperty({
    example: "minimi",
    enum: ["minimi"],
    description: "아이템 타입",
  })
  type: "minimi";

  @ApiProperty({ example: 100, description: "X 좌표" })
  left: number;

  @ApiProperty({ example: 200, description: "Y 좌표" })
  top: number;

  @ApiPropertyOptional({
    example: "https://example.com/image.png",
    description: "이미지 파일 URL (선택)",
  })
  file?: string;
}

export class SpeechBubbleItemDto {
  @ApiProperty({ example: 10, description: "말풍선 ID" })
  id: number;

  @ApiProperty({
    example: "speechBubble",
    enum: ["speechBubble"],
    description: "아이템 타입",
  })
  type: "speechBubble";

  @ApiProperty({ example: 120, description: "X 좌표" })
  left: number;

  @ApiProperty({ example: 80, description: "Y 좌표" })
  top: number;

  @ApiProperty({ example: "안녕하세요!", description: "텍스트 내용" })
  text: string;
}

@ApiExtraModels(MinimiItemDto, SpeechBubbleItemDto)
export class SaveMiniroomLayoutDto {
  @ApiProperty({
    description: "미니미 또는 말풍선 객체 배열",
    oneOf: [
      { $ref: getSchemaPath(MinimiItemDto) },
      { $ref: getSchemaPath(SpeechBubbleItemDto) },
    ],
    isArray: true,
    example: [
      {
        id: "default-minimi",
        type: "minimi",
        left: 100,
        top: 200,
        file: "https://example.com/image.png",
      },
      {
        id: 10,
        type: "speechBubble",
        left: 150,
        top: 250,
        text: "안녕!",
      },
    ],
  })
  items: (MinimiItemDto | SpeechBubbleItemDto)[];
}

@ApiExtraModels(MinimiItemDto, SpeechBubbleItemDto)
export class GetMiniroomLayoutResDto {
  @ApiProperty({
    type: "array",
    oneOf: [
      { $ref: getSchemaPath(MinimiItemDto) },
      { $ref: getSchemaPath(SpeechBubbleItemDto) },
    ],
    description: "미니미 및 말풍선 정보 목록",
  })
  items: (MinimiItemDto | SpeechBubbleItemDto)[];
}
