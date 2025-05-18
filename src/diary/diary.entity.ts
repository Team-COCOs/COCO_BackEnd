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
import { DiaryComment } from "../diary_comments/diary_comments.entity";
import { DiaryFolder } from "./diaryFolder.entity";

export enum VisibilityType {
  PUBLIC = "public",
  PRIVATE = "private",
  FRIENDS_ONLY = "friends",
}

@Entity("diary")
export class Diary {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: User;

  @ManyToOne(() => DiaryFolder, (folder) => folder.diarys, {
    nullable: true,
    onDelete: "SET NULL",
  })
  @JoinColumn({ name: "folder_id" })
  folder: DiaryFolder;

  @Column({ type: "varchar", length: 100 })
  mood: string;

  @Column({ type: "varchar", length: 100 })
  weather: string;

  @Column({ type: "text" })
  content: string;

  @Column({
    type: "enum",
    enum: VisibilityType,
    default: VisibilityType.PUBLIC,
  })
  visibility: VisibilityType;

  @OneToMany(() => DiaryComment, (comment) => comment.diary)
  comments: DiaryComment[];

  @Column({ type: "int", default: 0 })
  view_count: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
