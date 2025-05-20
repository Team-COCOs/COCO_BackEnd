import { Guestbook } from "../guestbooks/guestbooks.entity";
import { User } from "../users/users.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("guestbook_comments")
export class GuestbookComment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "host_id" })
  host: User;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "author_id" })
  author: User;
  // 작성자

  @ManyToOne(() => Guestbook, (guestbook) => guestbook.comments, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "guestbook_id" })
  guestbook: Guestbook;

  @Column("text")
  content: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
