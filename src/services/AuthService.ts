import { AppDataSource } from "../data-source.js";
import { User } from "../entities/user.js";
import { verifyPassword } from "./ArgonService.js";
import { sign } from "jsonwebtoken";

type VerifyUserRequest = {
  email: string;
  password: string;
};

type AuthResponse = Pick<User, "name" | "email"> & {
  token: string;
};

export class AuthService {
  async verify({ email, password }: VerifyUserRequest): Promise<AuthResponse> {
    const userRepository = AppDataSource.getRepository(User);

    const foundUser = await userRepository.findOne({
      where: { email },
      select: {
        user_id: true,
        name: true,
        email: true,
        password_hash: true,
      },
    });

    if (!foundUser) {
      throw new Error("Email or password incorrect");
    }

    const isPasswordValid = await verifyPassword(foundUser.password_hash, password);

    if (!isPasswordValid) {
      throw new Error("Email or password incorrect");
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error("JWT_SECRET is not configured");
    }

    const token = sign({}, secret, {
      subject: foundUser.user_id,
      expiresIn: "1d",
    });

    return {
      name: foundUser.name,
      email: foundUser.email,
      token,
    };
  }
}
