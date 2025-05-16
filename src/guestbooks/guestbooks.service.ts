import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Guestbook } from "./guestbooks.entity";
import { Repository } from "typeorm";
import { UsersService } from "src/users/users.service";

@Injectable()
export class GuestbooksService {
  constructor(
    @InjectRepository(Guestbook)
    private readonly guestbooksRepository: Repository<Guestbook>,
    private readonly usersService: UsersService
  ) {}

  // 방명록 작성
  async create(authorId: number, hostId: number, content: string) {
    const author = await this.usersService.findUserById(authorId);
    const host = await this.usersService.findUserById(hostId);

    const comment = this.guestbooksRepository.create({
      author,
      host,
      content,
    });

    return this.guestbooksRepository.save(comment);
  }

  // 방명록 조회
  async getComments(hostId: number) {
    const comments = await this.guestbooksRepository.find({
      where: { host: { id: hostId } },
      relations: ["author", "host"],
      order: { created_at: "DESC" },
    });

    return comments.map((comment) => {
      const created_at = new Date(comment.created_at);
      created_at.setHours(created_at.getHours() + 9);

      return {
        id: comment.id,
        authorId: comment.author.id,
        hostId: comment.host.id,
        authorRealName: comment.author.name,
        hostRealName: comment.host.name,
        content: comment.content,
        created_at: created_at.toISOString().replace("T", " ").substring(0, 16),
      };
    });
  }

  // 삭제
  async delete(authorId: number, hostId: number) {
    const comment = await this.guestbooksRepository.findOne({
      where: { host: { id: hostId }, author: { id: authorId } },
      relations: ["author", "host"],
    });

    if (!comment) {
      const hostComment = await this.guestbooksRepository.findOne({
        where: { host: { id: hostId } },
        relations: ["author", "host"],
      });

      if (!hostComment || hostComment.host.id !== authorId) {
        throw new NotFoundException("삭제할 일촌평이 존재하지 않습니다.");
      }

      await this.guestbooksRepository.remove(hostComment);
      return { message: "일촌평이 삭제되었습니다." };
    }

    await this.guestbooksRepository.remove(comment);
    return { message: "일촌평이 삭제되었습니다." };
  }
}
