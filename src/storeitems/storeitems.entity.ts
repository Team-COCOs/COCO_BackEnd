import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

export enum StoreItemType {
  TAPCOLOR = "tapcolor",
  MINIHOMEPIS = "minihomepis",
  DIARY_BG = "diary_background",
  MINIROOM = "miniroom",
  MINIMI = "minimi",
  BGM = "bgm",
}
@Entity("store_items")
export class StoreItems {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  file: string;

  @Column()
  price: number;

  @Column({
    type: "enum",
    enum: StoreItemType,
  })
  category: StoreItemType;

  @Column({ type: "varchar", length: 100, nullable: true })
  artist: string;

  @Column({ type: "int", nullable: true })
  duration: number;

  @CreateDateColumn()
  created_at: Date;
}
