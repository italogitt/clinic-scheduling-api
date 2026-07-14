import { AppDataSource } from "../data-source.js";
import { User } from "../entities/user.js";
import { hashPassword } from "./ArgonService.js";

type CreateUserRequest = Pick<User, "name" | "email" | "phone"> & { password: string };

export class UserService {
  async execute({ name, email, phone, password }: CreateUserRequest): Promise<User> {
    const userRepository = AppDataSource.getRepository(User);

    const userAlreadyExists = await userRepository.findOneBy({ email });

    if (userAlreadyExists) {
      throw new Error("Email already registered");
    }

    const hashedPassword = await hashPassword(password);

    const user = userRepository.create({
      name,
      email,
      phone,
      password_hash: hashedPassword,
    });

    await userRepository.save(user);

    return user;
  }

  async findAll(): Promise<User[]> {
    const userRepository = AppDataSource.getRepository(User);

    const finddedUsers = userRepository.find();

    return finddedUsers;
  }
}
