import { VisibilityStatus } from "../guestbooks.entity";

export interface GuestbookResponseDto {
  id: number;
  authorId: number;
  hostId: number;
  authorRealName: string;
  hostRealName: string;
  content: string;
  isSecret: VisibilityStatus;
  created_at: string;
}
