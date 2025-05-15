import {
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  Column,
  ManyToOne,
} from "typeorm";
import { User } from "../users/users.entity";
import { StoreItems } from "src/storeitems/storeitems.entity";

export enum LanguageType {
  KO = "ko",
  ENG = "en",
}

@Entity("useritem")
export class UserItem {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: User;

  @ManyToOne(() => StoreItems, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "diary_background_id" })
  diaryBackgroundItem: StoreItems;
  // 배경 아이템

  @ManyToOne(() => StoreItems, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "skin_item_id" })
  skinItem: StoreItems;
  // 미니홈피 스킨 아이템

  @ManyToOne(() => StoreItems, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "miniroom_item_id" })
  miniroomItem: StoreItems;
  // 미니룸 아이템

  @ManyToOne(() => StoreItems, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "minimi_item_id" })
  minimiItem: StoreItems;
  // 미니미 아이템

  @ManyToOne(() => StoreItems, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "tab_color_id" })
  tabColorItem: StoreItems;
  // tab 아이템

  @ManyToOne(() => StoreItems, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "bgm_id" })
  bgmItem: StoreItems;
  // BGM 아이템

  @Column("json", { nullable: true })
  tabs: string[];
  // 탭

  @Column({ type: "enum", enum: LanguageType, default: "ko" })
  language: LanguageType;
}
