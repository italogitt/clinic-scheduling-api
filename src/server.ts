import { app } from "./app.js";
import { AppDataSource } from "./data-source.js";

AppDataSource.initialize()
  .then(() => {
    console.log("Running");
    app.listen(3000);
  })
  .catch((error) => {
    console.error("Erro fatal ao conectar com o banco de dados", error);
  });

