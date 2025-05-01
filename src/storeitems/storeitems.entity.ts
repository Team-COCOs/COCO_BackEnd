import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

export enum StoreItemType {
  TAPCOLOR = "tapcolor",
  MINIHOMEPIS = "minihomepis",
  MINIROOM = "miniroom",
  MINIMI = "minimi",
  DIARY_BG = "diary_background",
}
@Entity("store_items")
export class StoreItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  image_url: string;

  @Column()
  price: number;

  @Column({
    type: "enum",
    enum: StoreItemType,
  })
  type: StoreItemType;

  @CreateDateColumn()
  created_at: Date;
}
