// dto/create-speech-bubble.dto.ts
import { IsInt, IsString } from "class-validator";

export class CreateSpeechBubbleDto {
  @IsString()
  text: string;

  @IsInt()
  left: number;

  @IsInt()
  top: number;

  @IsInt()
  miniroomId: number;
}
