import type { Request, Response } from "express";
import { ServiceService } from "../services/ServiceService.js";
import { createServiceSchema, updateServiceSchema } from "../schemas/serviceSchema.js";
import { ZodError } from "zod";

export class ServiceController {
  async create(req: Request, res: Response): Promise<Response> {
    try {
      const serviceService = new ServiceService();
      const { name, price, duration_minutes } = createServiceSchema.parse(req.body);

      const service = await serviceService.execute({ name, price, duration_minutes });

      return res.status(201).json(service);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: error.issues[0]?.message ?? "Validation error" });
      }
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async findAll(req: Request, res: Response): Promise<Response> {
    try {
      const serviceService = new ServiceService();

      const services = await serviceService.findAll();

      return res.status(200).json(services);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async findById(req: Request, res: Response): Promise<Response> {
    try {
      const serviceService = new ServiceService();
      const { service_id } = req.params;

      if (!service_id || typeof service_id !== "string") {
        return res.status(400).json({ error: "Invalid or missing servie ID" });
      }

      const service = await serviceService.findById({ service_id });

      return res.status(200).json(service);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ error: "Internal server error " });
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    try {
      const serviceService = new ServiceService();
      const { service_id } = req.params;

      if (!service_id || typeof service_id !== "string") {
        return res.status(400).json({ error: " or missing service ID" });
      }

      const { name, price, duration_minutes } = updateServiceSchema.parse(req.body);

      const service = await serviceService.update(
        { service_id },
        { name, price, duration_minutes },
      );
      return res.status(200).json(service);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: error.issues[0]?.message ?? "Validation error" });
      }
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const serviceService = new ServiceService();
      const { service_id } = req.params;

      if (!service_id || typeof service_id !== "string") {
        return res.status(400).json({ error: "Invalid or missing service ID" });
      }

      await serviceService.delete({ service_id });

      return res.status(200).json({ message: "Service successfully deleted" });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}
