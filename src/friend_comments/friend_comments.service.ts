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
  async getComments(hostId: number) {
    // 해당 호스트에 대해 작성된 모든 일촌평
    const comments = await this.friendCommentsRepository.find({
      where: { host: { id: hostId } },
      relations: ["author", "host"],
      order: { created_at: "DESC" },
    });

    // 작성자당 하나씩만 유지되도록 Map 사용
    const uniqueByAuthor = new Map<number, (typeof comments)[0]>();

    for (const c of comments) {
      if (!uniqueByAuthor.has(c.author.id)) {
        uniqueByAuthor.set(c.author.id, c);
      }
    }

    const results = [];

    for (const comment of uniqueByAuthor.values()) {
      const friendship = await this.friendsService.getFriendshipBetween(
        comment.author.id,
        comment.host.id
      );

      if (!friendship) continue;

      const isRequester = friendship.requester.id === comment.author.id;

      const created_at = new Date(comment.created_at);
      created_at.setHours(created_at.getHours() + 9);

      results.push({
        id: comment.id,
        authorId: comment.author.id,
        hostId: comment.host.id,
        authorRealName: comment.author.name,
        hostRealName: comment.host.name,
        authorName: isRequester
          ? friendship.requester_name
          : friendship.receiver_name,
        hostName: isRequester
          ? friendship.receiver_name
          : friendship.requester_name,
        content: comment.content,
        created_at: comment.created_at
          .toISOString()
          .replace("T", " ")
          .substring(0, 16),
      });
    }

    return results;
  }

  // 삭제
  async delete(authorId: number, hostId: number) {
    const comment = await this.friendCommentsRepository.findOne({
      where: { host: { id: hostId }, author: { id: authorId } },
      relations: ["author", "host"],
    });

    if (!comment) {
      const hostComment = await this.friendCommentsRepository.findOne({
        where: { host: { id: hostId } },
        relations: ["author", "host"],
      });

      if (!hostComment || hostComment.host.id !== authorId) {
        throw new NotFoundException("삭제할 일촌평이 존재하지 않습니다.");
      }
    }

    await this.friendCommentsRepository.remove(comment);
    return { message: "일촌평이 삭제되었습니다." };
  }
}
