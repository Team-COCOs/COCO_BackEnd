// user-items.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from "typeorm";
import { User } from "../users/users.entity";
import { StoreItem } from "../storeitems/storeitems.entity";

@Entity("purchase")
export class Purchase {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: User;

  @ManyToOne(() => StoreItem, { onDelete: "CASCADE" })
  @JoinColumn({ name: "store_item_id" })
  storeItem: StoreItem;

  @CreateDateColumn()
  acquired_at: Date;
}
