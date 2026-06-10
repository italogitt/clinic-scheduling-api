import { AppDataSource } from "../data-source.js";
import { User } from "../entities/user.js";
import * as argon from "argon2";

type CreateUserRequest = Pick<User, "name" | "email" | "phone"> & { password: string };

export class UserService {
  async execute({ name, email, phone, password }: CreateUserRequest): Promise<User> {
    const userRepository = AppDataSource.getRepository(User);

    const userAlreadyExists = await userRepository.findOneBy({ email });

    if (userAlreadyExists) {
      throw new Error("Email already registered");
    }

    const hashedPassword = await argon.hash(password);

    const user = userRepository.create({
      name,
      email,
      phone,
      password_hash: hashedPassword,
    });

    await userRepository.save(user);

    return user;
  }
}
