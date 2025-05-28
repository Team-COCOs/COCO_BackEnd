import { ApiProperty } from "@nestjs/swagger";
import { LanguageType } from "../useritems.entity";

export class LanguageResDto {
  @ApiProperty({ enum: LanguageType, example: LanguageType.KO })
  language: LanguageType;
}
