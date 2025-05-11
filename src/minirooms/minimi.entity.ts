// minimi.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
} from "typeorm";
import { StoreItems } from "../storeitems/storeitems.entity";
import { MiniRoom } from "./minirooms.entity";

@Entity("minimis")
export class Minimi {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => StoreItems, { onDelete: "SET NULL", nullable: true })
  @JoinColumn({ name: "store_item_id" })
  storeItem: StoreItems;
  // 미니미 아이템

  @Column({ type: "int" })
  left: number;

  @Column({ type: "int" })
  top: number;

  @ManyToOne(() => MiniRoom, (miniroom) => miniroom.minimis, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "miniroom_id" })
  miniroom: MiniRoom;
}
