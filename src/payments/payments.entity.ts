import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from "typeorm";
import { User } from "../users/users.entity";

@Entity("payments")
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column({ unique: true, nullable: false })
  order_id: string;

  @Column()
  amount: number;

  @Column()
  dotori_amount: number;

  @CreateDateColumn()
  created_at: Date;

  @Column({ nullable: true })
  toss_payment_id: string;
}
