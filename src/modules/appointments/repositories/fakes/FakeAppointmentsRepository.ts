/**
 * This repository is similar to the original one in `infra/typeorm/repositories`
 * but makes no real connection to the database
 */

import { uuid } from 'uuidv4';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import { isEqual, getMonth, getYear, getDate } from 'date-fns';
import IAvailabilityInMonthForProviderDTO from '@modules/appointments/dtos/IAvailabilityInMonthForProviderDTO';
import IAvailabilityInDayForProviderDTO from '@modules/appointments/dtos/IAvailabilityInDayForProviderDTO';

export default class FakeAppointmentsRepository
  implements IAppointmentsRepository {
  private appointments: Appointment[] = [];

  public async create({
    provider_id,
    client_id,
    date,
  }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = new Appointment();

    appointment.id = uuid();
    appointment.date = date;
    appointment.provider_id = provider_id;
    appointment.client_id = client_id;

    // one liner:
    // Object.assign(appointment, { id: uuid(), date, provider_id })

    this.appointments.push(appointment);

    return appointment;
  }

  public async find(): Promise<Appointment[]> {
    return this.appointments;
  }

  public async findByDate(date: Date): Promise<Appointment | undefined> {
    return this.appointments.find(appointment =>
      isEqual(appointment.date, date),
    );
  }

  public async findAvailabilityInMonthForProvider({
    provider_id,
    month,
    year,
  }: IAvailabilityInMonthForProviderDTO): Promise<Appointment[]> {
    const appointments = this.appointments.filter(
      appointment =>
        appointment.provider_id === provider_id &&
        getMonth(appointment.date) + 1 === month &&
        getYear(appointment.date) === year,
    );

    return appointments;
  }

  public async findAvailabilityInDayForProvider({
    provider_id,
    day,
    month,
    year,
  }: IAvailabilityInDayForProviderDTO): Promise<Appointment[]> {
    const appointments = this.appointments.filter(
      appointment =>
        appointment.provider_id === provider_id &&
        getDate(appointment.date) === day &&
        getMonth(appointment.date) + 1 === month &&
        getYear(appointment.date) === year,
    );

    return appointments;
  }
}
