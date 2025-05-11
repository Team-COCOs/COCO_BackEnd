import { IsString, IsOptional } from "class-validator";

export class SaveDiaryFolderDto {
  @IsString()
  key: string;

  @IsString()
  title: string;

  @IsOptional()
  parent_id?: string;

  @IsOptional()
  user_id?: number;
}
