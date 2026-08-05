import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

type TokenPayload = {
  sub: string;
};

export class AuthMiddleware {
  async validate(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const autorizationHeader = req.headers.authorization;

      if (!autorizationHeader) {
        return res.status(401).json({ error: "Token missing" });
      }

      const parts = autorizationHeader?.split(" ");

      if (parts?.length !== 2) {
        return res.status(401).json({ error: "Token error" });
      }

      const [scheme, token] = parts;

      if (!scheme || !token) {
        return res.status(401).json({ error: "Token missing or malformatted" });
      }

      if (!/^Bearer$/i.test(scheme)) {
        return res.status(401).json({ error: "Token malformatted" });
      }
      const secret = process.env.JWT_SECRET;

      if (!secret) {
        return res.status(500).json({ error: "JWT_SECRET is not configured" });
      }

      const decoded = jwt.verify(token, secret) as TokenPayload;

      req.user_id = decoded.sub;

      return next();
    } catch (error) {
      if (error instanceof Error) {
        return res.status(401).json({ error: error.message });
      }
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}
