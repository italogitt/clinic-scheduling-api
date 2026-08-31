import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(2, "Name must have at least 2 characters"),
  email: z.string().email("Invalid email format"),
  phone: z.string().min(10, "Phone must have at least 10 characters"),
  password: z.string().min(6, "Password must have at least 6 characters"),
});
