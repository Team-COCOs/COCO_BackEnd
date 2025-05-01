import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { User } from "../users/users.entity";
import { DiaryComment } from "src/diary_comments/diary_comments.entity";

@Entity("diary")
export class Diary {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column({ type: "varchar", length: 100 })
  title: string;

  @Column({ type: "text" })
  content: string;

  @Column({ type: "boolean", default: true })
  public: boolean;

  @OneToMany(() => DiaryComment, (comment) => comment.diary)
  comments: DiaryComment[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
