import express from "express";
import { AppDataSource } from "./data-source.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "API de agendamento operando com sucesso",
  });
});

AppDataSource.initialize()
  .then(() => {
    console.log("Banco de dados conectado com sucesso");

    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Erro fatal ao conectar com o banco de dados", error);
  });
