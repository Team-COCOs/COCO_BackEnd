import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Guestbook, VisibilityStatus } from "./guestbooks.entity";
import { In, MoreThan, Repository } from "typeorm";
import { UsersService } from "../users/users.service";
import { GuestbookResponseDto } from "./dto/guestbookRes.dto";

@Injectable()
export class GuestbooksService {
  constructor(
    @InjectRepository(Guestbook)
    private readonly guestbooksRepository: Repository<Guestbook>,
    private readonly usersService: UsersService
  ) {}

  // 방명록 작성
  async create(
    authorId: number,
    hostId: number,
    content: string,
    status: VisibilityStatus
  ): Promise<Guestbook> {
    const author = await this.usersService.findUserById(authorId);
    const host = await this.usersService.findUserById(hostId);

    const comment = this.guestbooksRepository.create({
      author,
      host,
      content,
      status,
    });

    return this.guestbooksRepository.save(comment);
  }

  // 방명록 조회
  async getComments(
    hostId: number,
    viewerId?: number
  ): Promise<GuestbookResponseDto[]> {
    const targetUser = await this.usersService.findUserById(hostId);
    if (!targetUser)
      throw new NotFoundException("해당 유저를 찾을 수 없습니다.");

    const allComments = await this.guestbooksRepository.find({
      where: { host: { id: hostId } },
      relations: ["author", "host"],
      order: { created_at: "DESC" },
    });

    const numericViewerId =
      viewerId !== undefined ? Number(viewerId) : undefined;

    const filtered = allComments.filter((comment) => {
      const isPublic = comment.status === VisibilityStatus.PUBLIC;
      const isOwner =
        numericViewerId !== undefined && comment.host.id === numericViewerId;
      const isAuthor =
        numericViewerId !== undefined && comment.author.id === numericViewerId;
      return isPublic || isOwner || isAuthor;
    });

    return filtered.map((comment) => {
      const created_at = new Date(comment.created_at);
      created_at.setHours(created_at.getHours() + 9);

      return {
        id: comment.id,
        authorId: comment.author.id,
        hostId: comment.host.id,
        authorRealName: comment.author.name,
        authorProfile: comment.author.minimi_image,
        authorGender: comment.author.gender,
        hostRealName: comment.host.name,
        content: comment.content,
        status: comment.status,
        created_at: created_at.toISOString().replace("T", " ").substring(0, 16),
        isMine:
          numericViewerId !== undefined &&
          comment.author.id === numericViewerId,
      };
    });
  }

  // 방명록 공개/비공개 전환
  async changeVisibility(
    hostId: number,
    guestbookId: number,
    visibility: VisibilityStatus
  ) {
    const guestbook = await this.guestbooksRepository.findOne({
      where: { id: guestbookId },
      relations: ["host"],
    });

    if (!guestbook) {
      throw new NotFoundException("방명록을 찾을 수 없습니다.");
    }

    // host만 수정 가능
    if (guestbook.host.id !== hostId) {
      throw new ForbiddenException(
        "방명록의 visibility는 해당 미니홈피 주인만 수정할 수 있습니다."
      );
    }

    guestbook.status = visibility;
    await this.guestbooksRepository.save(guestbook);

    return {
      message: `방명록이 ${visibility === VisibilityStatus.PRIVATE ? "비공개" : "공개"}로 설정되었습니다.`,
    };
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
        throw new NotFoundException("삭제할 방명록이 존재하지 않습니다.");
      }
    }

    await this.guestbooksRepository.remove(comment);
    return { message: "방명록이 삭제되었습니다." };
  }

  // 오늘 새로 올린 게시글 개수
  async getTodayGuestBookCount(userId: number): Promise<number> {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    return await this.guestbooksRepository.count({
      where: {
        host: { id: userId },
        created_at: MoreThan(todayStart),
      },
    });
  }

  // 총 게시글 개수
  async getTotalGuestBookCount(userId: number): Promise<number> {
    return await this.guestbooksRepository.count({
      where: { host: { id: userId } },
    });
  }
}
