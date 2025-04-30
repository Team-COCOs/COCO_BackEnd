import { User } from "../users/users.entity";
export declare enum SenderType {
    USER = "user",
    BOT = "bot"
}
export declare class ChatbotMessage {
    id: number;
    user: User;
    sender: SenderType;
    content: string;
    created_at: Date;
}
