import { User } from "../users/users.entity";
export declare enum FriendStatus {
    PENDING = "pending",
    ACCEPTED = "accepted",
    REJECTED = "rejected"
}
export declare class Friend {
    id: number;
    requester: User;
    receiver: User;
    requester_name: string;
    receiver_name: string;
    status: FriendStatus;
    created_at: Date;
}
