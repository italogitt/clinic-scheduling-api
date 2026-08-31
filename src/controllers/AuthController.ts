import type { Request, Response } from "express";
import { AuthService } from "../services/AuthService.js";
import { loginSchema } from "../schemas/authSchema.js";
import { ZodError } from "zod";

export class AuthController {
  async login(req: Request, res: Response): Promise<Response> {
    try {
      const authService = new AuthService();
      const { email, password } = loginSchema.parse(req.body);

      const login = await authService.verify({ email, password });

      return res.status(200).json(login);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: error.issues[0]?.message ?? "Validation error" });
      }
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}
