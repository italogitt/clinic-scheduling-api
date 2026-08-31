import { z } from "zod";

export const createAppointmentSchema = z.object({
  service_id: z.string().uuid("Invalid service ID"),
  service_date: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),
});

export const updateAppointmentSchema = z.object({
  service_id: z.string().uuid("Invalid service ID"),
  appointment_id: z.string().uuid("Invalid appointment ID"),
  service_date: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),
});
