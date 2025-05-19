import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { User } from "../users/users.entity";
import { Photo } from "../photos/photos.entity";

@Entity("photo_folders")
export class PhotoFolder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 100 })
  title: string;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  user: User;

  @ManyToOne(() => PhotoFolder, (folder) => folder.children, {
    nullable: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "parent_id" })
  parent: PhotoFolder;

  @OneToMany(() => PhotoFolder, (folder) => folder.parent)
  children: PhotoFolder[];

  @OneToMany(() => Photo, (photo) => photo.folder, {
    cascade: true,
    onDelete: "CASCADE",
  })
  photos: Photo[];

  @Column({ default: false })
  is_deleted: boolean;
}
