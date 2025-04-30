import { User } from "../users/users.entity";
export declare class Payment {
    id: number;
    user: User;
    order_id: string;
    amount: number;
    dotori_amount: number;
    created_at: Date;
    toss_payment_id: string;
}
