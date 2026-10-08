import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity("phoneAuthCode")
export class PhoneAuthCode {
  @PrimaryGeneratedColumn("uuid")
  phoneAuthCode_id: string;

  @Column({ type: "varchar", length: 20 })
  phone: string;

  @Column({ type: "varchar" })
  code_hash: string;

  @Column({ type: "timestamp" })
  expires_at: Date;

  @Column({ type: "boolean", default: false })
  verified: boolean;

  @Column({ type: "int", default: 0 })
  attempts: number;

  @CreateDateColumn()
  created_at: Date;
}
