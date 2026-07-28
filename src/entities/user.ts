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

  @Column({ type: "varchar", length: 20 })
  phone: string;

  @Column({ type: "varchar", unique: true, length: 100 })
  email: string;

  @Column({ type: "varchar", select: false })
  password_hash: string;

  @Column({ type: "enum", enum: UserRole, default: UserRole.CLIENT })
  role: UserRole;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
