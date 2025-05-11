import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from "typeorm";
import { StoreItems } from "../storeitems/storeitems.entity"; // 미니미 아이템 엔티티
import { User } from "../users/users.entity";
import { SpeechBubble } from "./speechBubble.entity";
import { Minimi } from "./minimi.entity";

@Entity("minirooms")
export class MiniRoom {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: User;

  @ManyToOne(() => StoreItems, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "store_item_id" })
  storeItem: StoreItems;
  // 미니룸 아이템

  @OneToMany(() => Minimi, (minimi) => minimi.miniroom)
  minimis: Minimi[];
  // 미니미

  @Column({ type: "int" })
  minimi_position_left: number;
  // 미니미 X좌표

  @Column({ type: "int" })
  minimi_position_top: number;
  // 미니미 Y좌표

  @OneToMany(() => SpeechBubble, (bubble) => bubble.miniroom)
  speechBubbles: SpeechBubble[];
  // 말풍선

  @CreateDateColumn()
  created_at: Date;
}
