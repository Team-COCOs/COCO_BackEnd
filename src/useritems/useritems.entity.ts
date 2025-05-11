import {
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  Column,
  ManyToOne,
} from "typeorm";
import { User } from "../users/users.entity";
import { Purchase } from "../purchases/purchases.entity";
@Entity("useritem")
export class UserItem {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: User;

  @ManyToOne(() => Purchase, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "purchase_id" })
  purchase: Purchase;

  @Column({ nullable: true })
  skin_item_id: number;

  @Column({ nullable: true })
  miniroom_item_id: number;

  @Column({ nullable: true })
  minimi_item_id: number;

  @Column({ nullable: true })
  diary_background_id: number;

  @Column({ nullable: true })
  bgm_id: number;

  @Column({ type: "varchar", length: 10, nullable: true })
  tab_color: string;

  @Column({ type: "varchar", nullable: true })
  font: string;

  @Column({ type: "varchar", length: 5, default: "ko" })
  language: string;
}
