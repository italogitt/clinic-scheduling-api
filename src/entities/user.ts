import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

export enum UserRole {
  ADMIN = "ADMIN",
  CLIENT = "CLIENT",
}

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  user_id: string;

  @Column({ type: "varchar", length: 100 })
  name: string;

  @Column({ type: "varchar", unique: true, length: 20 })
  phone: string;

  @Column({ type: "varchar", unique: true, nullable: true, length: 100 })
  email: string | null;

  @Column({ type: "varchar", nullable: true, select: false })
  password_hash: string | null;

  @Column({ type: "enum", enum: UserRole, default: UserRole.CLIENT })
  role: UserRole;

  @Column({ type: "boolean", default: true })
  active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
