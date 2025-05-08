import { User } from "../users/users.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  OneToMany,
} from "typeorm";

import { PhotoComment } from "../photos_comments/photos_comments.entity";

@Entity("photos")
export class Photo {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column({ type: "varchar", length: 100 })
  folder_name: string;

  @Column({ type: "varchar", length: 255 })
  photo_url: string;

  @Column({ type: "varchar", length: 100 })
  title: string;

  @Column({ type: "text" })
  content: string;

  @OneToMany(() => PhotoComment, (comment) => comment.photo)
  comments: PhotoComment[];

  @Column({ type: "int", default: 0 })
  view_count: number;

  @Column({ type: "int", default: 0 })
  use_count: number;

  @Column({ type: "boolean", default: true })
  public: boolean;

  @CreateDateColumn()
  created_at: Date;
}
