import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

@Entity("mini_homepi_skins")
export class MiniHomepiSkin {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  image_url: string;

  @Column()
  price: number;

  @CreateDateColumn()
  created_at: Date;
}
