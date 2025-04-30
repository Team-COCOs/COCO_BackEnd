import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

export enum StoreItemType {
  SKIN = "skin",
  MINIROOM = "miniroom",
  MINIMI = "minimi",
  DIARY_BG = "diary_background",
  BGM = "bgm",
  FONT = "font",
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
