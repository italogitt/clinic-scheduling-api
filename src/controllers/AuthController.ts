import type { Request, Response } from "express";
import { AuthService } from "../services/AuthService.js";

export class AuthController {
  async login(req: Request, res: Response): Promise<Response> {
    try {
      const authService = new AuthService();
      const { email, password } = req.body;

      if (!email || !password) {
        throw new Error("Email and password are required");
      }

      const login = await authService.verify({ email, password });

      return res.status(200).json(login);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}
