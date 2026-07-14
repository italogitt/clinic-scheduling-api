import { AppDataSource } from "../data-source.js";
import { User } from "../entities/user.js";
import { hashPassword } from "./ArgonService.js";

type CreateUserRequest = Pick<User, "name" | "email" | "phone"> & { password: string };
type UserSelectedId = { user_id: string };

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

  async delete({ user_id }: UserSelectedId) {
    const userRepository = AppDataSource.getRepository(User);

    const userExists = await userRepository.findOneBy({ user_id });

    if (!userExists) {
      throw new Error("User not found");
    }
    await userRepository.delete(user_id);
  }
}
