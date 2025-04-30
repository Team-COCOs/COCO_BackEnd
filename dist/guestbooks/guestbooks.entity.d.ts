import { User } from "../users/users.entity";
export declare enum VisibilityStatus {
    PRIVATE = "private",
    PUBLIC = "public"
}
export declare class Guestbook {
    id: number;
    host: User;
    guest: User;
    content: string;
    status: VisibilityStatus;
    created_at: Date;
}
