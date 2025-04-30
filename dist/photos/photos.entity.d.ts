import { User } from "../users/users.entity";
export declare class Photo {
    id: number;
    user: User;
    folder_name: string;
    photo_url: string;
    description: string | null;
    created_at: Date;
}
