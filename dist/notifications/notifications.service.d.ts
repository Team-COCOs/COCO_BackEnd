import { Repository } from "typeorm";
import { Notification } from "./notifications.entity";
export declare class NotificationsService {
    private readonly notificationRepository;
    constructor(notificationRepository: Repository<Notification>);
    findByUser(userId: number): Promise<{
        notification: [Notification[], number];
    }>;
    create(receiverUserId: number, message: string, senderUserId?: number): Promise<Notification>;
    markAsRead(userId: number): Promise<void>;
    hasUnread(userId: number): Promise<boolean>;
}
