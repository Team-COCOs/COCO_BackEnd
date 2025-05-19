import { VisibilityStatus } from "../guestbooks.entity";

export interface GuestbookResponseDto {
  id: number;
  authorId: number;
  hostId: number;
  authorRealName: string;
  hostRealName: string;
  content: string;
  status: VisibilityStatus;
  created_at: string;
}
