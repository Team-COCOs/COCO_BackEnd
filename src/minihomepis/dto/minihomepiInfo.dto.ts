import { ApiProperty } from "@nestjs/swagger";

export class MinihomepiInfoDto {
  minihomepi_image?: string;
  mood?: string;
  introduction?: string;
  title?: string;
}
export class MinihomepiStatusDto {
  @ApiProperty({ example: "유민이의 미니홈피", nullable: true })
  title: string | null;

  @ApiProperty({ example: "행복 😊", nullable: true })
  mood: string | null;

  @ApiProperty({ example: "안녕하세요! 반가워요~", nullable: true })
  introduction: string | null;

  @ApiProperty({ example: "/uploads/profile.jpg", nullable: true })
  minihomepi_image: string | null;
}
