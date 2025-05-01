import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
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
  // 썸네일 또는 미리듣기용

  @Column({ type: "varchar", length: 255 })
  audio_file: string;
  // 실제 음원 파일 경로

  @Column({ type: "int" })
  duration: number;

  @CreateDateColumn()
  created_at: Date;
}
