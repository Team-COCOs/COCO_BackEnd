import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PhotoComment } from "./photos_comments.entity";
import { Repository } from "typeorm";
import { PhotosService } from "src/photos/photos.service";
import { UserRole } from "src/users/users.entity";

@Injectable()
export class PhotosCommentsService {
  constructor(
    @InjectRepository(PhotoComment)
    private readonly commentRepository: Repository<PhotoComment>,

    @Inject(forwardRef(() => PhotosService))
    private readonly photosService: PhotosService
  ) {}

  // 댓글 작성하기
  async createComment(
    userId: number,
    postId: number,
    comment: string,
    parentId?: number
  ): Promise<any> {
    const newComment = this.commentRepository.create({
      user: { id: userId },
      photo: { id: postId },
      comment,
      parentComment: parentId ? { id: parentId } : undefined,
    });

    const savedComment = await this.commentRepository.save(newComment);

    const fullComment = await this.commentRepository.findOne({
      where: { id: savedComment.id },
      relations: ["user", "photo", "parentComment"],
    });

    return {
      id: fullComment.id,
      comment: fullComment.comment,
      author: fullComment.user.name,
      authorId: fullComment.user.id,
      date: fullComment.created_at.toISOString(),
      children: [],
    };
  }

  // 게시글 당 댓글
  async getCommentsByPost(postId: number): Promise<any[]> {
    const comments = await this.commentRepository.find({
      where: { photo: { id: postId } },
      relations: ["user", "parentComment"],
      order: { created_at: "ASC" },
    });

    const parentComments = comments.filter((c) => !c.parentComment);
    const childrenMap = new Map<number, any[]>();

    comments.forEach((comment) => {
      if (comment.parentComment) {
        const parentId = comment.parentComment.id;
        if (!childrenMap.has(parentId)) {
          childrenMap.set(parentId, []);
        }
        childrenMap.get(parentId)?.push({
          id: comment.id,
          comment: comment.comment,
          author: comment.user.name,
          authorId: comment.user.id,
          date: comment.created_at.toISOString(),
          children: [],
        });
      }
    });

    return parentComments.map((parent) => ({
      id: parent.id,
      comment: parent.comment,
      author: parent.user.name,
      authorId: parent.user.id,
      date: parent.created_at.toISOString(),
      children: childrenMap.get(parent.id) || [],
    }));
  }

  // 댓글 수
  async countCommentsByPostId(postId: number): Promise<number> {
    return this.commentRepository.count({
      where: { photo: { id: postId } },
    });
  }

  // 댓글 삭제
  async deleteComment(
    commentId: number,
    userId: number
  ): Promise<{ ok: boolean }> {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
      relations: ["user", "photo", "photo.user"],
    });

    if (!comment) {
      throw new NotFoundException("댓글을 찾을 수 없습니다.");
    }

    const isAuthor = comment.user.id === userId;
    const isOwnerOfPost = comment.photo.user.id === userId;

    if (!isAuthor && !isOwnerOfPost) {
      throw new NotFoundException("삭제 권한이 없습니다.");
    }

    await this.commentRepository.remove(comment);
    return { ok: true };
  }
}
