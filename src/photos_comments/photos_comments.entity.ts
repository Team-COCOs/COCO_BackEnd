import { User } from "../users/users.entity";
import { Photo } from "../photos/photos.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from "typeorm";

@Entity("photo_comments")
export class PhotoComment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Photo, (photo) => photo.comments, { onDelete: "CASCADE" })
  @JoinColumn({ name: "diary_id" })
  photo: Photo;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column({ type: "text" })
  content: string;

  @ManyToOne(() => PhotoComment, { nullable: true, onDelete: "CASCADE" })
  @JoinColumn({ name: "parent_comment_id" })
  parentComment: PhotoComment;

  @CreateDateColumn()
  created_at: Date;
}
