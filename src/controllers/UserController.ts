import type { Response, Request } from "express";
import { UserService } from "../services/UserService.js";

export class UserController {
  async create(req: Request, res: Response): Promise<Response> {
    try {
      const userService = new UserService();

      const { name, email, phone, password } = req.body;

      const user = await userService.execute({ name, email, phone, password });

      const { password_hash, ...userWithoutPassword } = user;

      return res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async findAll(req: Request, res: Response) {
    try {
      const userService = new UserService();
      const users = await userService.findAll();

      const usersWithoutPassword = users.map((user) => {
        const { password_hash, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });

      return res.status(200).json(usersWithoutPassword);
    } catch {
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}
