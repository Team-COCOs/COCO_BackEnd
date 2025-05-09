import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { User } from "../users/users.entity";
import { Diary } from "../diary/diary.entity";

@Entity("diary_folders")
export class DiaryFolder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 100 })
  title: string;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  user: User;

  @ManyToOne(() => DiaryFolder, (folder) => folder.children, {
    nullable: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "parent_id" })
  parent: DiaryFolder;

  @OneToMany(() => DiaryFolder, (folder) => folder.parent)
  children: DiaryFolder[];

  @OneToMany(() => Diary, (diary) => diary.folder)
  diarys: Diary[];
}
