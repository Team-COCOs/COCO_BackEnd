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

  // 일촌 신청
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

  // 수락
  async accept(requesterId: number, receiverId: number) {
    const friendship = await this.friendsRepository.findOne({
      where: {
        requester: { id: requesterId },
        receiver: { id: receiverId },
        status: FriendStatus.PENDING,
      },
    });
    if (!friendship) {
      throw new NotFoundException("해당 일촌 요청을 찾을 수 없습니다.");
    }

    friendship.status = FriendStatus.ACCEPTED;
    await this.friendsRepository.save(friendship);

    const receiver = await this.usersService.findUserById(receiverId);
    await this.notificationsService.create(
      requesterId,
      `${receiver?.name || "누군가"}님이 일촌 신청을 수락했습니다.`,
      receiverId
    );
  }

  // 수락
  async reject(requesterId: number, receiverId: number) {
    const friendship = await this.friendsRepository.findOne({
      where: {
        requester: { id: requesterId },
        receiver: { id: receiverId },
        status: FriendStatus.PENDING,
      },
    });
    if (!friendship) {
      throw new NotFoundException("해당 일촌 요청을 찾을 수 없습니다.");
    }

    friendship.status = FriendStatus.REJECTED;
    await this.friendsRepository.save(friendship);

    const receiver = await this.usersService.findUserById(receiverId);
    await this.notificationsService.create(
      requesterId,
      `${receiver?.name || "누군가"}님이 일촌 신청을 거절했습니다.`,
      receiverId
    );
  }
}
