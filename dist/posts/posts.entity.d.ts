import { User } from "../users/users.entity";
export declare class Post {
    id: number;
    user: User;
    title: string;
    content: string;
    view_count: number;
    is_public: boolean;
    created_at: Date;
    updated_at: Date;
}
