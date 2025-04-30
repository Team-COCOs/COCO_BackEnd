import { User } from "../users/users.entity";
export declare class Diary {
    id: number;
    user: User;
    title: string;
    content: string;
    is_public: boolean;
    created_at: Date;
    updated_at: Date;
}
