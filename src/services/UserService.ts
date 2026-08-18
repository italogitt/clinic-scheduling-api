import { AppDataSource } from "../data-source.js";
import { User } from "../entities/user.js";
import { hashPassword } from "./ArgonService.js";

type CreateUserRequest = Pick<User, "name" | "email" | "phone"> & { password: string };
type UserSelectedId = { user_id: string };
type UpdateUserRequest = Partial<Pick<User, "name" | "email" | "phone">>;

export class UserService {
  async execute({
    name,
    email,
    phone,
    password,
  }: CreateUserRequest): Promise<Omit<User, "password_hash">> {
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

    const { password_hash, ...userWhitoutPassword } = user;

    return userWhitoutPassword;
  }

  async findAll(): Promise<User[]> {
    const userRepository = AppDataSource.getRepository(User);

    const foundUsers = await userRepository.find({
      where: { active: true },
    });

    return foundUsers;
  }

  async findById(user_id: string): Promise<User> {
    const userRepository = AppDataSource.getRepository(User);

    const foundUser = await userRepository.findOneBy({ user_id });

    if (!foundUser) {
      throw new Error("User not found");
    }
    return foundUser;
  }

  async update(
    { user_id }: UserSelectedId,
    { name, email, phone }: UpdateUserRequest,
  ): Promise<User> {
    const userRepository = AppDataSource.getRepository(User);

    const user = await userRepository.findOneBy({ user_id });

    if (!user) {
      throw new Error("User not found");
    }

    if (email && email !== user.email) {
      const emailInUse = await userRepository.findOneBy({ email });
      if (emailInUse) {
        throw new Error("Email already in use");
      }
    }

    user.name = name ?? user.name;
    user.email = email ?? user.email;
    user.phone = phone ?? user.phone;

    return await userRepository.save(user);
  }

  async delete({ user_id }: UserSelectedId): Promise<void> {
    const userRepository = AppDataSource.getRepository(User);

    const userExists = await userRepository.findOneBy({ user_id });

    if (!userExists) {
      throw new Error("User not found");
    }

    userExists.active = false;

    await userRepository.save(userExists);
  }
}
