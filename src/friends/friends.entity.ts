import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Column,
} from "typeorm";
import { User } from "../users/users.entity";

export enum FriendStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
}
@Entity("friends")
export class Follow {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "requester_id" })
  requester: User;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "accepter_id" })
  accepter: User;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "requester_id" })
  requester_name: User;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "accepter_id" })
  accepter_name: User;

  @Column({ type: "enum", enum: FriendStatus })
  status: FriendStatus;

  @CreateDateColumn()
  created_at: Date;
}
