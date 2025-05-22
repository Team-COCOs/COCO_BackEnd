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
}
@Entity("friends")
export class Friend {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "requester_id" })
  requester: User;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "receiver_id" })
  receiver: User;

  // 내가 상대를 부르는 이름
  @Column({ type: "varchar", length: 50, nullable: true })
  requester_name: string;

  // 상대가 나를 부르는 이름
  @Column({ type: "varchar", length: 50, nullable: true })
  receiver_name: string;

  // 요청 메시지
  @Column({ type: "varchar", length: 50, nullable: true })
  message: string;

  @Column({ type: "enum", enum: FriendStatus })
  status: FriendStatus;

  @CreateDateColumn()
  created_at: Date;
}
