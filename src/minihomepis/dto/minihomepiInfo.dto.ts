export class MinihomepiInfoDto {
  minihomepi_image?: string;
  mood?: string;
  introduction?: string;
  title?: string;
}

export class MinihomepiStatusDto {
  title: string;
  mood: string | null;
  introduction: string | null;
  minihomepi_image: string | null;
}
