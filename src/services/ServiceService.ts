import { AppDataSource } from "../data-source.js";
import { Service } from "../entities/service.js";

type CreateServiceRequest = Pick<Service, "name" | "price" | "duration_minutes">;
type ServiceSelectedId = { service_id: string };

export class ServiceService {
  async execute({ name, price, duration_minutes }: CreateServiceRequest): Promise<Service> {
    const serviceRepository = AppDataSource.getRepository(Service);

    if (price <= 0 || duration_minutes <= 0) {
      throw new Error("Price and duration in minutes need to be greater than zero");
    }

    const nameAlreadyExists = await serviceRepository.findOneBy({ name });

    if (nameAlreadyExists) {
      throw new Error("Service already registered with this name");
    }

    const service = serviceRepository.create({
      name,
      price,
      duration_minutes,
    });

    await serviceRepository.save(service);

    return service;
  }

  async findAll(): Promise<Service[]> {
    const serviceRepository = AppDataSource.getRepository(Service);

    const foundServices = await serviceRepository.find({ where: { active: true } });

    return foundServices;
  }

  async findById({ service_id }: ServiceSelectedId): Promise<Service> {
    const serviceRepository = AppDataSource.getRepository(Service);

    const foundService = await serviceRepository.findOne({ where: { service_id } });

    if (!foundService) {
      throw new Error("Service not found");
    }

    return foundService;
  }

  async update(
    { service_id }: ServiceSelectedId,
    { name, price, duration_minutes }: Partial<CreateServiceRequest>,
  ): Promise<Service> {
    const serviceRepository = AppDataSource.getRepository(Service);

    if (
      (price !== undefined && price <= 0) ||
      (duration_minutes !== undefined && duration_minutes <= 0)
    ) {
      throw new Error("Price and duration in minutes need to be greater than zero");
    }

    const service = await serviceRepository.findOneBy({ service_id });

    if (!service) {
      throw new Error("Service not found");
    }

    if (name) {
      const nameAlreadyExists = await serviceRepository.findOneBy({ name });

      if (nameAlreadyExists && nameAlreadyExists.service_id !== service_id) {
        throw new Error("Service already registered with this name");
      }
    }

    service.name = name ?? service.name;
    service.price = price ?? service.price;
    service.duration_minutes = duration_minutes ?? service.duration_minutes;

    return await serviceRepository.save(service);
  }

  async delete({ service_id }: ServiceSelectedId): Promise<void> {
    const serviceRepository = AppDataSource.getRepository(Service);

    const foundService = await serviceRepository.findOneBy({ service_id });

    if (!foundService) {
      throw new Error("Service not found");
    }

    foundService.active = false;

    await serviceRepository.save(foundService);
  }
}
