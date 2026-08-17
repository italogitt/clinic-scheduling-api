import type { Request, Response } from "express";
import { AppointmentService } from "../services/AppointmentService.js";

export class AppointmentController {
  async create(req: Request, res: Response): Promise<Response> {
    try {
      const appointmentService = new AppointmentService();

      const { user_id, service_id, service_date } = req.body;

      const appointment = await appointmentService.execute({ user_id, service_id, service_date });

      return res.status(201).json(appointment);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async findAll(req: Request, res: Response): Promise<Response> {
    try {
      const appointmentService = new AppointmentService();

      const appointments = await appointmentService.findAll();

      return res.status(200).json(appointments);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async findByUser(req: Request, res: Response): Promise<Response> {
    try {
      const appointmentService = new AppointmentService();

      const { user_id } = req.params;

      if (!user_id || typeof user_id !== "string") {
        return res.status(400).json({ error: "Invalid or missing user ID" });
      }

      const appointments = await appointmentService.findByUser(user_id);

      return res.status(200).json(appointments);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    try {
      const appointmentService = new AppointmentService();
      const { user_id } = req.params;

      if (!user_id || typeof user_id !== "string") {
        return res.status(400).json({ error: "Invalid or missing user ID" });
      }

      const { service_id, appointment_id, service_date } = req.body;

      if (
        typeof service_id !== "string" ||
        typeof appointment_id !== "string" ||
        typeof service_date !== "string"
      ) {
        return res
          .status(400)
          .json({ error: "Invalid or missing service ID, appointmente ID and service date" });
      }

      const appointment = await appointmentService.update({
        user_id,
        service_id,
        appointment_id,
        service_date,
      });

      return res.status(200).json(appointment);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async cancel(req: Request, res: Response): Promise<Response> {
    try {
      const appointmentService = new AppointmentService();

      const { user_id, appointment_id } = req.params;

      if (typeof user_id !== "string" || typeof appointment_id !== "string") {
        return res.status(400).json({ error: "user_id and appointment_id type must be String" });
      }

      const appointment = await appointmentService.cancel({ user_id, appointment_id });

      return res.status(200).json({ appointment: appointment, message: "Sucessfully canceld" });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}
