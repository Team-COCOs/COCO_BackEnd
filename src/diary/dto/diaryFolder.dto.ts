import { IsString, IsOptional, IsInt } from "class-validator";

export class SaveDiaryFolderDto {
  @IsOptional()
  @IsInt()
  id?: number;

  @IsString()
  key: string;

  @IsString()
  title: string;

  @IsOptional()
  parent_id?: string;

  @IsOptional()
  user_id?: number;
}
