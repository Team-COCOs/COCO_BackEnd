import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "../users/users.entity";

@Entity("minihomepis")
export class Minihomepi {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column({ type: "varchar", length: 100 })
  title: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  mood: string;

  @Column({ type: "varchar", length: 50, nullable: true })
  introduction: string;

  @Column({ type: "varchar", nullable: true })
  minihomepi_image: string;

  @Column({ type: "text", nullable: true })
  quote: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
