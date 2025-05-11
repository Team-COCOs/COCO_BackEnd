import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "../users/users.entity";
import { StoreItems } from "src/storeitems/storeitems.entity";
import { MiniRoom } from "./minirooms.entity";

@Entity("speech_bubbles")
export class SpeechBubble {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  user: User;

  @Column({ type: "varchar", length: 255 })
  text: string;

  @Column({ type: "int" })
  left: number;
  // 말풍선 위치 (X좌표)

  @Column({ type: "int" })
  top: number;
  // 말풍선 위치 (Y좌표)

  @ManyToOne(() => MiniRoom, (miniroom) => miniroom.speechBubbles, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "miniroom_id" })
  miniroom: MiniRoom;

  @ManyToOne(() => StoreItems, { nullable: true, onDelete: "SET NULL" })
  storeItem: StoreItems;
}
