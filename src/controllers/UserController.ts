import type { Response, Request } from "express";
import { UserService } from "../services/UserService.js";

export class UserController {
  async create(req: Request, res: Response): Promise<Response> {
    try {
      const userService = new UserService();
      const { name, email, phone, password } = req.body;

      const user = await userService.execute({ name, email, phone, password });

      return res.status(201).json(user);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async findAll(req: Request, res: Response): Promise<Response> {
    try {
      const userService = new UserService();
      const users = await userService.findAll();

      return res.status(200).json(users);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async findById(req: Request, res: Response): Promise<Response> {
    try {
      const userService = new UserService();
      const { user_id } = req.params;

      if (!user_id || typeof user_id !== "string") {
        return res.status(400).json({ error: "Invalid or missing user ID" });
      }

      if (req.params.user_id !== req.user_id) {
        return res.status(403).json({ error: "Unauthorized access " });
      }

      const user = await userService.findById({ user_id });

      return res.status(200).json(user);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ error: "Internal server error " });
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    try {
      const userService = new UserService();
      const { user_id } = req.params;

      if (!user_id || typeof user_id !== "string") {
        return res.status(400).json({ error: "Invalid or missing user ID" });
      }

      const { name, email, phone } = req.body;

      if (req.params.user_id !== req.user_id) {
        return res.status(403).json({ error: "Unauthorized accses" });
      }

      const user = await userService.update({ user_id }, { name, email, phone });
      return res.status(200).json(user);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ error: "Internal server error " });
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const userService = new UserService();
      const { user_id } = req.params;

      if (!user_id || typeof user_id !== "string") {
        return res.status(400).json({ error: "Invalid or missing user ID" });
      }

      if (req.params.user_id !== req.user_id) {
        return res.status(403).json({ error: "Unauthorized access" });
      }

      await userService.delete({ user_id });
      return res.status(200).json({ message: "User succesfully deleted" });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}
