import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Friend, FriendStatus } from "./friends.entity";
import { User } from "../users/users.entity";
import { NotificationsService } from "../notifications/notifications.service";
import { UsersService } from "../users/users.service";

@Injectable()
export class FriendsService {
  constructor(
    @InjectRepository(Friend)
    private readonly friendsRepository: Repository<Friend>,
    private readonly usersService: UsersService,
    private readonly notificationsService: NotificationsService
  ) {}

  // 일촌 맺기
  async request(
    requesterId: number,
    receiverId: number,
    requester_name: string,
    receiver_name: string
  ) {
    if (requesterId === receiverId)
      throw new BadRequestException("자기 자신에게 신청할 수 없습니다.");

    const existing = await this.friendsRepository.findOne({
      where: [
        { requester: { id: requesterId }, receiver: { id: receiverId } },
        { requester: { id: receiverId }, receiver: { id: requesterId } },
      ],
    });

    if (existing) throw new ConflictException("이미 요청되었거나 일촌입니다.");

    const request = this.friendsRepository.create({
      requester: { id: requesterId },
      receiver: { id: receiverId },
      requester_name,
      receiver_name,
      status: FriendStatus.PENDING,
    });

    await this.friendsRepository.save(request);

    const requester = await this.usersService.findUserById(requesterId);

    await this.notificationsService.create(
      receiverId,
      `${requester?.name || "누군가"}님이 일촌 신청을 보냈습니다.`,
      requesterId
    );
  }
}
