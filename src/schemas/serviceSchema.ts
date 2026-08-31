import { z } from "zod";

export const createServiceSchema = z.object({
  name: z.string().min(2, "Name must have at least 2 characters"),
  price: z.number().positive("Price must be greater than zero"),
  duration_minutes: z.number().int().positive("Duration must be greater than zero"),
});

export const updateServiceSchema = z.object({
  name: z.string().min(2, "Name must have at least 2 characters").optional(),
  price: z.number().positive("Price must be greater than zero").optional(),
  duration_minutes: z.number().int().positive("Duration must be greater than zero").optional(),
});
