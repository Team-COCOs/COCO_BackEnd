import { VisibilityStatus } from "../guestbooks.entity";

export interface GuestbookResponseDto {
  id: number;
  authorId: number;
  hostId: number;
  authorRealName: string;
  authorProfile: string;
  authorGender: string;
  hostRealName: string;
  content: string;
  status: VisibilityStatus;
  created_at: string;
  isMine: boolean;
  comments: {
    id: number;
    content: string;
    authorId: number;
    authorName: string;
    created_at: string;
  }[];
}
