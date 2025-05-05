import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from "typeorm";
import { User } from "../users/users.entity";

@Entity("visits")
export class Visit {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "host_id" })
  host: User;

  // 방문한 유저
  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "visitor_id" })
  visitor: User;

  @CreateDateColumn({ name: "visited_at" })
  visitedAt: Date;
}
