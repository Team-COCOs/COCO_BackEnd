import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

export enum Gender {
  MALE = "male",
  FEMALE = "female",
}

export enum UserRole {
  USER = "user",
  ADMIN = "admin",
}

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 50, unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ type: "varchar", length: 20, unique: true, nullable: true })
  name: string | null;

  @Column({ type: "varchar", length: 15, nullable: true, unique: true })
  phone: string | null;

  @Column({ type: "boolean", default: false })
  isPhoneVerified: boolean;

  @Column({ type: "enum", enum: Gender, nullable: true })
  gender: Gender | null;

  @Column({ type: "varchar", nullable: true })
  profile_image: string;

  @Column({ type: "varchar", nullable: true })
  minimi_image: string;

  @Column({ type: "enum", enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Column({ type: "int", default: 0 })
  dotoris: number;

  @Column({ type: "varchar", nullable: true })
  refresh_token: string | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
