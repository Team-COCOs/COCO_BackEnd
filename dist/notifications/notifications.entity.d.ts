import { User } from "../users/users.entity";
export declare class Notification {
    id: number;
    receiver: User;
    sender: User;
    message: string;
    isRead: boolean;
    created_at: Date;
}
