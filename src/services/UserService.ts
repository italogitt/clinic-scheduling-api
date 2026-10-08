import { AppDataSource } from "../data-source.js";
import { User, UserRole } from "../entities/user.js";
import { hashPassword } from "./ArgonService.js";

type CreateUserRequest = {
  name: string;
  phone: string;
  email?: string;
  password?: string;
  role?: UserRole;
};
type UserSelectedId = { user_id: string };
type UpdateUserRequest = {
  name?: string;
  phone?: string;
  email?: string;
  password?: string;
};

export class UserService {
  async execute({
    name,
    phone,
    email,
    password,
    role = UserRole.CLIENT,
  }: CreateUserRequest): Promise<Omit<User, "password_hash">> {
    const userRepository = AppDataSource.getRepository(User);

    if (role == UserRole.ADMIN) {
      if (!email || !password) {
        throw new Error("Admin users require email and password");
      }
    }

    const phoneAlreadyExists = await userRepository.findOneBy({ phone });
    if (phoneAlreadyExists) {
      throw new Error("Phone already registred");
    }

    if (email) {
      const emailAlreadyExists = await userRepository.findOneBy({ email });
      if (emailAlreadyExists) {
        throw new Error("Email already registred");
      }
    }

    const password_hash = password ? await hashPassword(password) : null;

    const user = userRepository.create({
      name,
      phone,
      email: email ?? null,
      password_hash,
      role,
    });

    await userRepository.save(user);

    const { password_hash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
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
