import { User } from "../users/users.entity";
export declare class Gift {
    id: number;
    sender: User;
    receiver: User;
    amount: number;
    created_at: Date;
}
