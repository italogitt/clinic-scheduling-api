import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

import { User } from "./user.js";
import { Service } from "./service.js";

export enum AppointmentStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  COMPLETED = "COMPLETED",
  CANCELED = "CANCELED",
}

@Entity("appointment")
export class Appointment {
  @PrimaryGeneratedColumn("uuid")
  appointment_id: string;

  @Column({ type: "timestamp" })
  service_date: Date;

  @Column({ type: "enum", enum: AppointmentStatus, default: AppointmentStatus.PENDING })
  appointment_status: AppointmentStatus;

  @ManyToOne(() => User)
  @JoinColumn({ name: "user_id" })
  user!: User;

  @ManyToOne(() => Service)
  @JoinColumn({ name: "service_id" })
  service!: Service;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
