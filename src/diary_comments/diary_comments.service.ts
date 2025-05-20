import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { DiaryComment } from "./diary_comments.entity";
import { UserRole } from "../users/users.entity";

@Injectable()
export class DiaryCommentsService {
  constructor(
    @InjectRepository(DiaryComment)
    private readonly diaryCommentsRepository: Repository<DiaryComment>
  ) {}

  // 댓글 작성하기
  async createDiaryComment(
    userId: number,
    diaryId: number,
    content: string,
    parentCommentId?: number
  ): Promise<any> {
    const newComment = this.diaryCommentsRepository.create({
      user: { id: userId },
      diary: { id: diaryId },
      content,
      parentComment: parentCommentId ? { id: parentCommentId } : undefined,
    });

    const savedComment = await this.diaryCommentsRepository.save(newComment);

    const fullComment = await this.diaryCommentsRepository.findOne({
      where: { id: savedComment.id },
      relations: ["user", "diary", "diary.user", "parentComment"],
    });

    if (!fullComment || !fullComment.user || !fullComment.diary) {
      throw new NotFoundException(
        "댓글 조회 실패: 필요한 관계 데이터가 없습니다."
      );
    }

    return {
      id: fullComment.id,
      content: fullComment.content,
      created_at: fullComment.created_at,
      diaryId: fullComment.diary.id,
      parentCommentId: fullComment.parentComment?.id ?? null,
    };
  }

  // 게시글 당 댓글
  async getCommentsByDiary(diaryId: number): Promise<any[]> {
    const comments = await this.diaryCommentsRepository.find({
      where: { diary: { id: diaryId } },
      relations: ["user", "parentComment"],
      order: { created_at: "ASC" },
    });

    return comments.map((comment) => {
      return {
        id: comment.id,
        userId: comment.user.id,
        name: comment.user.name,
        content: comment.content,
        created_at: comment.created_at,
        parentCommentId: comment.parentComment?.id || null,
      };
    });
  }

  // 댓글 삭제
  async deleteDiaryComment(
    commentId: number,
    userId: number
  ): Promise<{ ok: boolean }> {
    const comment = await this.diaryCommentsRepository.findOne({
      where: { id: commentId },
      relations: ["user", "diary", "diary.user"],
    });

    if (!comment) {
      throw new NotFoundException("댓글을 찾을 수 없습니다.");
    }

    const isAuthor = comment.user.id === userId;
    const isOwnerOfPost = comment.diary.user.id === userId;

    if (!isAuthor && !isOwnerOfPost) {
      throw new NotFoundException("삭제 권한이 없습니다.");
    }
    await this.diaryCommentsRepository.remove(comment);
    return { ok: true };
  }
}
