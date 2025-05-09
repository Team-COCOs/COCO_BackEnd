import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UseGuards,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FriendComment } from "./friend_comments.entity";
import { Repository } from "typeorm";
import { FriendsService } from "../friends/friends.service";
import { UsersService } from "../users/users.service";

@Injectable()
export class FriendCommentsService {
  constructor(
    @InjectRepository(FriendComment)
    private readonly friendCommentsRepository: Repository<FriendComment>,
    private readonly friendsService: FriendsService,
    private readonly usersService: UsersService
  ) {}

  // 일촌평 작성
  async create(authorId: number, hostId: number, content: string) {
    const status = await this.friendsService.friendStatus(authorId, hostId);

    if (!status.areFriends) {
      throw new ForbiddenException(
        "서로 일촌인 경우에만 일촌평을 남길 수 있습니다."
      );
    }

    const author = await this.usersService.findUserById(authorId);
    const host = await this.usersService.findUserById(hostId);

    const existing = await this.friendCommentsRepository.findOne({
      where: { author: { id: authorId }, host: { id: hostId } },
    });

    if (existing) {
      existing.content = content;
      return this.friendCommentsRepository.save(existing);
    }

    const comment = this.friendCommentsRepository.create({
      author,
      host,
      content,
    });

    return this.friendCommentsRepository.save(comment);
  }

  // 조회
  async getComment(authorId: number, hostId: number) {
    const comment = await this.friendCommentsRepository.findOne({
      where: { author: { id: authorId }, host: { id: hostId } },
      order: { created_at: "DESC" },
      relations: ["author", "host"],
    });

    if (!comment) return null;

    // 친구 관계 확인
    const friendship = await this.friendsService.getFriendshipBetween(
      authorId,
      hostId
    );

    if (!friendship) {
      throw new NotFoundException("친구 관계를 찾을 수 없습니다.");
    }

    const isRequester = friendship.requester.id === authorId;

    const authorName = isRequester
      ? friendship.requester_name
      : friendship.receiver_name;

    const hostName = isRequester
      ? friendship.receiver_name
      : friendship.requester_name;

    return {
      id: comment.id,
      authorRealName: comment.author.name,
      hostRealName: comment.host.name,
      authorName,
      hostName,
      content: comment.content,
      createdAt: comment.created_at
        .toISOString()
        .replace("T", " ")
        .substring(0, 16),
    };
  }

  // 삭제
  async delete(authorId: number, hostId: number) {
    const comment = await this.friendCommentsRepository.findOne({
      where: {
        author: { id: authorId },
        host: { id: hostId },
      },
    });

    if (!comment) {
      throw new NotFoundException("삭제할 일촌평이 존재하지 않습니다.");
    }

    if (comment.author.id !== authorId) {
      throw new ForbiddenException(
        "본인이 작성한 일촌평만 삭제할 수 있습니다."
      );
    }

    await this.friendCommentsRepository.remove(comment);

    return { message: "일촌평이 삭제되었습니다." };
  }
}
