import "reflect-metadata";
import { DataSource } from "typeorm";
import * as dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "127.0.0.1",
  port: 5433,
  username: "admin",
  password: "admin_password_segura",
  database: "agendamento_clinica",

  synchronize: true,
  logging: true,

  entities: [],
  migrations: [],
  subscribers: [],
});
