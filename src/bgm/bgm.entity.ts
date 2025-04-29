import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from "typeorm";

@Entity("bgm")
export class BGM {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 100 })
  title: string;

  @Column({ type: "varchar", length: 100 })
  artist: string;

  @Column({ type: "varchar", length: 255 })
  url: string;

  @CreateDateColumn()
  created_at: Date;
}
