import { In } from "typeorm";
import { AppDataSource } from "../data-source.js";
import { Appointment, AppointmentStatus } from "../entities/appointment.js";
import { User } from "../entities/user.js";
import { Service } from "../entities/service.js";

type CreateAppointmentDTO = {
  user_id: string;
  service_id: string;
  service_date: Date | string;
};

type FindByUserDTO = {
  user_id: string;
};

type UpdateAppointmentDTO = {
  user_id: string;
  service_id: string;
  appointment_id: string;
  service_date: Date | string;
};

type CancelAppointmentDTO = {
  appointment_id: string;
};

export class AppointmentService {
  async execute({ user_id, service_id, service_date }: CreateAppointmentDTO): Promise<Appointment> {
    const appointmentRepository = AppDataSource.getRepository(Appointment);
    const userRepository = AppDataSource.getRepository(User);
    const serviceRepository = AppDataSource.getRepository(Service);

    if (!user_id || !service_id || !service_date) {
      throw new Error("User ID, Service ID, and Service Date are required");
    }

    const start = new Date(service_date);
    const currentDate = new Date();

    if (isNaN(start.getTime())) {
      throw new Error("Invalid date format");
    }

    if (start.getTime() <= currentDate.getTime()) {
      throw new Error("Appointment date must be in the future");
    }

    const foundUser = await userRepository.findOneBy({ user_id });
    if (!foundUser) {
      throw new Error("User not found");
    }

    const foundService = await serviceRepository.findOneBy({ service_id });
    if (!foundService) {
      throw new Error("Service not found");
    }

    if (!foundService.active) {
      throw new Error("Service is inactive and cannot be booked");
    }

    const end = new Date(start.getTime() + foundService.duration_minutes * 60 * 1000);

    const activeAppointments = await appointmentRepository.find({
      where: {
        appointment_status: In([AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED]),
      },
      relations: {
        service: true,
      },
    });

    const hasConflict = activeAppointments.some((existing) => {
      const existingStart = new Date(existing.service_date);
      const existingEnd = new Date(
        existingStart.getTime() + existing.service.duration_minutes * 60 * 1000,
      );

      return start < existingEnd && end > existingStart;
    });

    if (hasConflict) {
      throw new Error("This service is unavailable at the requested time");
    }

    const appointment = appointmentRepository.create({
      user: foundUser,
      service: foundService,
      service_date: start,
      appointment_status: AppointmentStatus.PENDING,
    });

    await appointmentRepository.save(appointment);

    return appointment;
  }

  async findAll(): Promise<Appointment[]> {
    const appointmentRepository = AppDataSource.getRepository(Appointment);

    const appointments = await appointmentRepository.find({
      relations: {
        user: true,
        service: true,
      },
    });

    return appointments;
  }

  async findByUser({ user_id }: FindByUserDTO): Promise<Appointment[]> {
    const appointmentRepository = AppDataSource.getRepository(Appointment);

    const appointment = await appointmentRepository.find({
      where: {
        user: {
          user_id: user_id,
        },
      },
      relations: {
        service: true,
      },
    });

    return appointment;
  }

  async update({
    user_id,
    service_id,
    appointment_id,
    service_date,
  }: UpdateAppointmentDTO): Promise<Appointment> {
    const appointmentRepository = AppDataSource.getRepository(Appointment);
    const userRepository = AppDataSource.getRepository(User);
    const serviceRepository = AppDataSource.getRepository(Service);

    if (!user_id || !service_id || !appointment_id || !service_date) {
      throw new Error("User ID, Service ID, Appointment ID, and Service Date are required");
    }

    const start = new Date(service_date);
    const currentDate = new Date();

    if (isNaN(start.getTime())) {
      throw new Error("Invalid date format");
    }

    if (start.getTime() <= currentDate.getTime()) {
      throw new Error("Appointment date must be in the future");
    }

    const foundUser = await userRepository.findOneBy({ user_id });

    if (!foundUser) {
      throw new Error("User not found");
    }

    const appointment = await appointmentRepository.findOneBy({ appointment_id });

    if (!appointment) {
      throw new Error("Appointment not found");
    }

    const foundService = await serviceRepository.findOneBy({ service_id });

    if (!foundService) {
      throw new Error("Service not found");
    }

    if (!foundService.active) {
      throw new Error("Service is inactive");
    }

    const end = new Date(start.getTime() + foundService.duration_minutes * 60 * 1000);

    const activeAppointments = await appointmentRepository.find({
      where: {
        appointment_status: In([AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED]),
      },
      relations: {
        service: true,
      },
    });

    const hasConflict = activeAppointments.some((existing) => {
      const existingStartDate = new Date(existing.service_date);
      const existingEndDate = new Date(
        existingStartDate.getTime() + existing.service.duration_minutes * 60 * 1000,
      );
      if (existing.appointment_id === appointment.appointment_id) {
        return false;
      }
      return start < existingEndDate && end > existingStartDate;
    });

    if (hasConflict) {
      throw new Error("This service is unavailable at the requested time");
    }

    appointment.service = foundService;
    appointment.service_date = start;
    appointment.user = foundUser;

    return await appointmentRepository.save(appointment);
  }

  async cancel({ appointment_id }: CancelAppointmentDTO): Promise<Appointment> {
    const appointmentRepository = AppDataSource.getRepository(Appointment);

    if (!appointment_id) {
      throw new Error("Appointment ID is required");
    }

    const appointment = await appointmentRepository.findOneBy({ appointment_id });

    if (!appointment) {
      throw new Error("Appointment not found");
    }

    if (appointment.appointment_status == AppointmentStatus.CANCELED) {
      throw new Error("Appointment already canceled");
    }

    appointment.appointment_status = AppointmentStatus.CANCELED;

    return await appointmentRepository.save(appointment);
  }
}
