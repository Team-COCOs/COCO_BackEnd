// user-items.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from "typeorm";
import { User } from "../users/users.entity";
import { StoreItems } from "../storeitems/storeitems.entity";

@Entity("purchase")
export class Purchase {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: User;

  @ManyToOne(() => StoreItems, { onDelete: "CASCADE" })
  @JoinColumn({ name: "store_item_id" })
  storeItems: StoreItems;

  @CreateDateColumn()
  acquired_at: Date;
}
