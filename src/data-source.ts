import "reflect-metadata";
import { DataSource } from "typeorm";
import * as dotenv from "dotenv";
import { User } from "./entities/user.js";
import { Service } from "./entities/service.js";
import { Appointment } from "./entities/appointment.js";
import { PhoneAuthCode } from "./entities/phoneAuthCode.js";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5433,
  username: "admin",
  password: "admin_password_segura",
  database: "agendamento_clinica",

  synchronize: false,
  logging: false,

  entities: [User, Service, Appointment, PhoneAuthCode],
  migrations: ["src/migrations/*.ts"],
  subscribers: [],
});
