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
import { User } from "src/users/users.entity";
import { Purchase } from "src/purchases/purchases.entity";

@Entity("minimis")
export class Minimi {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: User;

  @ManyToOne(() => StoreItems, { onDelete: "SET NULL", nullable: true })
  @JoinColumn({ name: "store_item_id" })
  storeItem: StoreItems;
  // 미니미 아이템

  @ManyToOne(() => Purchase, { nullable: true, eager: true })
  @JoinColumn({ name: "purchase_id" })
  purchase: Purchase;

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
