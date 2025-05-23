import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Column,
  OneToMany,
} from "typeorm";
import { User } from "../users/users.entity";
import { GuestbookComment } from "src/guestbooks_comments/guestbooks.entity";

export enum VisibilityStatus {
  PRIVATE = "private",
  PUBLIC = "public",
}
@Entity("guestbooks")
export class Guestbook {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "host_id" })
  host: User;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "author_id" })
  author: User;

  @Column({ type: "text" })
  content: string;

  @Column({
    type: "enum",
    enum: VisibilityStatus,
    default: VisibilityStatus.PUBLIC,
  })
  status: VisibilityStatus;

  @OneToMany(() => GuestbookComment, (comment) => comment.guestbook)
  comments: GuestbookComment[];

  @CreateDateColumn()
  created_at: Date;
}
