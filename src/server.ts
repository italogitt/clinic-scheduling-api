import express from "express";
import { AppDataSource } from "./data-source.js";
import { UserController } from "./controllers/UserController.js";
import { AuthController } from "./controllers/AuthController.js";
import { AuthMiddleware } from "./middlewares/authMiddleare.js";
import { ServiceController } from "./controllers/ServiceController.js";
import { AdminMiddleware } from "./middlewares/adminMiddleware.js";
import { AppointmentController } from "./controllers/AppointmentController.js";

const app = express();

app.use(express.json());

const userController = new UserController();
const authController = new AuthController();
const authMiddleware = new AuthMiddleware();
const serviceController = new ServiceController();
const adminMiddleware = new AdminMiddleware();
const appointmentController = new AppointmentController();

app.post("/users", (req, res) => userController.create(req, res));
app.post("/login", (req, res) => authController.login(req, res));
app.post("/services", authMiddleware.validate, (req, res) => serviceController.create(req, res));
app.post("/appointments", authMiddleware.validate, (req, res) =>
  appointmentController.create(req, res),
);

app.get("/users", authMiddleware.validate, (req, res) => userController.findAll(req, res));
app.get("/users/:user_id", authMiddleware.validate, (req, res) =>
  userController.findById(req, res),
);
app.get("/services", (req, res) => serviceController.findAll(req, res));
app.get("/services/:service_id", (req, res) => serviceController.findById(req, res));
app.get("/appointments", authMiddleware.validate, adminMiddleware.validade, (req, res) =>
  appointmentController.findAll(req, res),
);
app.get("/appointments/users/:user_id", authMiddleware.validate, (req, res) =>
  appointmentController.findByUser(req, res),
);

app.put("/users/:user_id", authMiddleware.validate, (req, res) => userController.update(req, res));
app.put("/services/:service_id", authMiddleware.validate, (req, res) =>
  serviceController.update(req, res),
);
app.put("/appointments/user/:user_id", authMiddleware.validate, (req, res) =>
  appointmentController.update(req, res),
);
app.put(
  "/appointments/:appointment_id/confirm",
  authMiddleware.validate,
  adminMiddleware.validade,
  (req, res) => appointmentController.confirm(req, res),
);
app.put(
  "/appointments/:appointment_id/complete",
  authMiddleware.validate,
  adminMiddleware.validade,
  (req, res) => appointmentController.complete(req, res),
);

app.delete("/users/:user_id", authMiddleware.validate, (req, res) =>
  userController.delete(req, res),
);
app.delete("/services/:service_id", authMiddleware.validate, (req, res) =>
  serviceController.delete(req, res),
);
app.delete("/appointments/:appointment_id", authMiddleware.validate, (req, res) =>
  appointmentController.cancel(req, res),
);

AppDataSource.initialize()
  .then(() => {
    console.log("Running");
    app.listen(3000);
  })
  .catch((error) => {
    console.error("Erro fatal ao conectar com o banco de dados", error);
  });
