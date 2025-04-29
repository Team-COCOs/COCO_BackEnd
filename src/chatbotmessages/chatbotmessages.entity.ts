import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Column,
} from "typeorm";
import { User } from "../users/users.entity";

export enum SenderType {
  USER = "user",
  BOT = "bot",
}

@Entity("chatbotmessages")
export class ChatbotMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column({ type: "enum", enum: SenderType })
  sender: SenderType;

  @Column({ type: "text" })
  content: string;

  @CreateDateColumn()
  created_at: Date;
}
