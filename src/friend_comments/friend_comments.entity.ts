import { User } from "../users/users.entity";
import { Friend } from "../friends/friends.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("friend_comments")
export class FriendComment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  host: User;

  @ManyToOne(() => User)
  author: User;
  // 작성자

  @Column("text")
  content: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
