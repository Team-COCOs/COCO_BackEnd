import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { GuestbookComment } from "./guestbooks.entity";
import { Repository } from "typeorm";

@Injectable()
export class GuestbooksCommentsService {
  constructor(
    @InjectRepository(GuestbookComment)
    private readonly guestCommentsRepository: Repository<GuestbookComment>
  ) {}

  // 댓글 작성하기
  async createComment(
    userId: number,
    guestbookId: number,
    content: string
  ): Promise<any> {
    const newComment = this.guestCommentsRepository.create({
      author: { id: userId },
      guestbook: { id: guestbookId },
      content,
    });

    const savedComment = await this.guestCommentsRepository.save(newComment);

    const fullComment = await this.guestCommentsRepository.findOne({
      where: { id: savedComment.id },
      relations: ["author", "guestbook"],
    });

    if (!fullComment || !fullComment.author || !fullComment.guestbook) {
      throw new NotFoundException("댓글 조회 실패: 관계 데이터가 없습니다.");
    }

    return {
      id: fullComment.id,
      content: fullComment.content,
      created_at: fullComment.created_at,
      guestbookId: fullComment.guestbook.id,
      authorName: fullComment.author.name,
    };
  }

  // 댓글 삭제
  async deleteComment(
    commentId: number,
    userId: number
  ): Promise<{ ok: boolean }> {
    const comment = await this.guestCommentsRepository.findOne({
      where: { id: commentId },
      relations: ["author", "guestbook", "guestbook.host"],
    });

    if (!comment) {
      throw new NotFoundException("댓글을 찾을 수 없습니다.");
    }

    const isAuthor = comment.author.id === userId;
    const isHost = comment.guestbook.host.id === userId;

    if (!isAuthor && !isHost) {
      throw new NotFoundException("삭제 권한이 없습니다.");
    }

    await this.guestCommentsRepository.remove(comment);
    return { ok: true };
  }
}
