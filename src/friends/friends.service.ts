import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Friend, FriendStatus } from "./friends.entity";
import { UsersService } from "../users/users.service";
import { FriendListDto, NewFriendDto } from "./dto/friends.dto";

@Injectable()
export class FriendsService {
  constructor(
    @InjectRepository(Friend)
    private readonly friendsRepository: Repository<Friend>,
    private readonly usersService: UsersService
  ) {}

  // 일촌 신청 전 실명
  async getNames(
    requesterId: number,
    receiverId: number
  ): Promise<{ requesterName: string; receiverName: string }> {
    if (requesterId === receiverId) {
      throw new BadRequestException("자기 자신은 선택할 수 없습니다.");
    }

    const requester = await this.usersService.findUserById(requesterId);
    const receiver = await this.usersService.findUserById(receiverId);

    if (!receiver) {
      throw new NotFoundException("상대 사용자를 찾을 수 없습니다.");
    }

    return {
      requesterName: requester.name,
      receiverName: receiver.name,
    };
  }

  // 일촌 신청
  async request(
    requesterId: number,
    receiverId: number,
    requester_name: string,
    receiver_name: string,
    message: string
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
      message,
    });

    const saved = await this.friendsRepository.save(request);

    const requester = await this.usersService.findUserById(requesterId);

    return {
      requesterId,
      receiverId,
      create_at: saved.created_at.toISOString().substring(0, 10),
    };
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
  }

  // 거절
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
  }

  // 아직 수락되지 않은 일촌 요청
  async getNewFriendRequests(userId: number): Promise<NewFriendDto[]> {
    const reqs = await this.friendsRepository.find({
      where: {
        receiver: { id: userId },
        status: FriendStatus.PENDING,
      },
      relations: ["requester", "receiver"],
      order: { created_at: "DESC" },
      take: 10,
    });

    return reqs.map((r) => ({
      id: r.id,
      requesterId: r.requester.id,
      requester: r.requester.name,
      receiver: r.receiver.name,
      requester_name: r.requester_name,
      receiver_name: r.receiver_name,
      message: r.message,
      profileImg: r.requester.minimi_image,
      receivedAt: r.created_at.toISOString().substring(0, 10),
    }));
  }

  // 일촌인지 아닌지 상태 확인
  async friendStatus(
    requesterId: number,
    receiverId: number
  ): Promise<{ areFriends: boolean; requested: boolean; received: boolean }> {
    // 요청자가 받은 상태 (상대가 나에게 보낸 요청)
    const received = await this.friendsRepository.findOne({
      where: {
        requester: { id: receiverId },
        receiver: { id: requesterId },
        status: FriendStatus.PENDING,
      },
    });

    // 요청자가 보낸 상태 (내가 상대에게 보낸 요청)
    const requested = await this.friendsRepository.findOne({
      where: {
        requester: { id: requesterId },
        receiver: { id: receiverId },
        status: FriendStatus.PENDING,
      },
    });

    // 일촌 상태
    const areFriends = await this.friendsRepository.findOne({
      where: [
        {
          requester: { id: requesterId },
          receiver: { id: receiverId },
          status: FriendStatus.ACCEPTED,
        },
        {
          requester: { id: receiverId },
          receiver: { id: requesterId },
          status: FriendStatus.ACCEPTED,
        },
      ],
    });

    return {
      areFriends: !!areFriends,
      requested: !!requested,
      received: !!received,
    };
  }

  // 친구 목록
  async getFriends(userId: number): Promise<FriendListDto[]> {
    const relations = ["requester", "receiver"];
    const friends = await this.friendsRepository.find({
      where: [
        { requester: { id: userId }, status: FriendStatus.ACCEPTED },
        { receiver: { id: userId }, status: FriendStatus.ACCEPTED },
      ],
      relations,
      order: { created_at: "DESC" },
    });

    return friends.map((f) => {
      const isRequester = f.requester.id === userId;
      const friend = isRequester ? f.receiver : f.requester;

      return {
        id: f.id,
        userId: friend.id,
        friend: friend.name,
        profile_image: friend.minimi_image ?? "/avatarImg/default.png",
        myNaming: isRequester ? f.requester_name : f.receiver_name,
        theirNaming: isRequester ? f.receiver_name : f.requester_name,
        since: f.created_at.toISOString().replace("T", " ").substring(0, 16),
      };
    });
  }

  // 일촌 확인
  async getFriendshipBetween(
    userIdA: number,
    userIdB: number
  ): Promise<Friend | null> {
    return this.friendsRepository.findOne({
      where: [
        {
          requester: { id: userIdA },
          receiver: { id: userIdB },
          status: FriendStatus.ACCEPTED,
        },
        {
          requester: { id: userIdB },
          receiver: { id: userIdA },
          status: FriendStatus.ACCEPTED,
        },
      ],
      relations: ["requester", "receiver"],
    });
  }
}
