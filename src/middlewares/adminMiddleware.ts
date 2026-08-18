import type { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../data-source.js";
import { User, UserRole } from "../entities/user.js";

export class adminMiddleware {
  async validade(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const userRepository = AppDataSource.getRepository(User);
      const user_id = req.user_id;

      if (typeof user_id !== "string") {
        return res.status(400).json({ error: "User ID must be a string" });
      }

      const user = await userRepository.findOneBy({ user_id });

      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }

      if (user.role !== UserRole.ADMIN) {
        return res.status(403).json({ error: "Unauthorized" });
      }

      next();
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}
