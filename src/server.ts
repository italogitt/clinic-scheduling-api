import express from "express";
import { AppDataSource } from "./data-source.js";
import { UserController } from "./controllers/UserController.js";
import { AuthController } from "./controllers/AuthController.js";
import { AuthMiddleware } from "./middlewares/authMiddleare.js";

const app = express();

app.use(express.json());

const userController = new UserController();
const authController = new AuthController();
const authMiddleware = new AuthMiddleware();

app.post("/users", (req, res) => userController.create(req, res));
app.post("/login", (req, res) => authController.login(req, res));

app.get("/users", authMiddleware.validate, (req, res) => userController.findAll(req, res));
app.get("/users/:user_id", authMiddleware.validate, (req, res) =>
  userController.findById(req, res),
);

app.put("/users/:user_id", authMiddleware.validate, (req, res) => userController.update(req, res));

app.delete("/users/:user_id", authMiddleware.validate, (req, res) =>
  userController.delete(req, res),
);

AppDataSource.initialize()
  .then(() => {
    console.log("Running");
    app.listen(3000);
  })
  .catch((error) => {
    console.error("Erro fatal ao conectar com o banco de dados", error);
  });
