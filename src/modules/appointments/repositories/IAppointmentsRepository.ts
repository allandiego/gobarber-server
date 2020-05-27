/**
 * Provides an interface with all the methods we need to handle data
 */

import Appointment from '../infra/typeorm/entities/Appointment';
import ICreateAppointmentDTO from '../dtos/ICreateAppointmentDTO';
import IAvailabilityInMonthForProviderDTO from '../dtos/IAvailabilityInMonthForProviderDTO';
import IAvailabilityInDayForProviderDTO from '../dtos/IAvailabilityInDayForProviderDTO';

export default interface IAppointmentsRepository {
  create(data: ICreateAppointmentDTO): Promise<Appointment>;
  find(): Promise<Appointment[]>;
  findByDate(date: Date): Promise<Appointment | undefined>;
  findAvailabilityInMonthForProvider(
    data: IAvailabilityInMonthForProviderDTO,
  ): Promise<Appointment[]>;
  findAvailabilityInDayForProvider(
    data: IAvailabilityInDayForProviderDTO,
  ): Promise<Appointment[]>;
}
