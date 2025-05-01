import { User } from "../users/users.entity";
import { Diary } from "../diary/diary.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from "typeorm";

@Entity("diary_comments")
export class DiaryComment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Diary, (diary) => diary.comments, { onDelete: "CASCADE" })
  @JoinColumn({ name: "diary_id" })
  diary: Diary;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column({ type: "text" })
  content: string;

  @ManyToOne(() => DiaryComment, { nullable: true, onDelete: "CASCADE" })
  @JoinColumn({ name: "parent_comment_id" })
  parentComment: DiaryComment;

  @CreateDateColumn()
  created_at: Date;
}
