import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Column,
} from "typeorm";
import { User } from "../users/users.entity";

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

  @CreateDateColumn()
  created_at: Date;
}
