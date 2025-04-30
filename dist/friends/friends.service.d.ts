import { Repository } from "typeorm";
import { Friend } from "./friends.entity";
import { NotificationsService } from "../notifications/notifications.service";
import { UsersService } from "../users/users.service";
export declare class FriendsService {
    private readonly friendsRepository;
    private readonly usersService;
    private readonly notificationsService;
    constructor(friendsRepository: Repository<Friend>, usersService: UsersService, notificationsService: NotificationsService);
    request(requesterId: number, receiverId: number, requester_name: string, receiver_name: string): Promise<void>;
}
