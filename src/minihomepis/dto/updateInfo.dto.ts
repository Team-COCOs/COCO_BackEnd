export class UpdateMinihomepiDto {
  minihompi_image?: string;
  mood?: string;
  introduction?: string;
  title?: string;
}

export class MinihomepiStatusDto {
  title: string;
  mood: string | null;
  introduction: string | null;
  minihompi_image: string | null;
}
