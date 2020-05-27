/**
 * `typeorm` provides an default repository with commom methods.
 * But as we have an interface describing all the methods we need, we
 * code it bellow
 */

import { Repository, getRepository, Raw } from 'typeorm';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IAvailabilityInMonthForProviderDTO from '@modules/appointments/dtos/IAvailabilityInMonthForProviderDTO';
import IAvailabilityInDayForProviderDTO from '@modules/appointments/dtos/IAvailabilityInDayForProviderDTO';

class AppointmentsRepository implements IAppointmentsRepository {
  private ormRepository: Repository<Appointment>;

  constructor() {
    this.ormRepository = getRepository(Appointment);
  }

  public async create({
    provider_id,
    client_id,
    date,
  }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = this.ormRepository.create({
      provider_id,
      client_id,
      date,
    });

    await this.ormRepository.save(appointment);

    return appointment;
  }

  public async find(): Promise<Appointment[]> {
    const appointments = await this.ormRepository.find();

    return appointments;
  }

  public async findByDate(date: Date): Promise<Appointment | undefined> {
    const FindAppointment = await this.ormRepository.findOne({
      where: { date },
    });

    return FindAppointment;
  }

  public async findAvailabilityInMonthForProvider({
    provider_id,
    month,
    year,
  }: IAvailabilityInMonthForProviderDTO): Promise<Appointment[]> {
    const parsedMonth = String(month).padStart(2, '0');

    const appointments = await this.ormRepository.find({
      where: {
        provider_id,
        date: Raw(
          dateFieldName =>
            `to_char(${dateFieldName}, 'MM-YYYY') = '${parsedMonth}-${year}'`,
        ),
      },
    });

    return appointments;
  }

  public async findAvailabilityInDayForProvider({
    provider_id,
    day,
    month,
    year,
  }: IAvailabilityInDayForProviderDTO): Promise<Appointment[]> {
    const parsedDay = String(day).padStart(2, '0');
    const parsedMonth = String(month).padStart(2, '0');

    const appointments = await this.ormRepository.find({
      where: {
        provider_id,
        date: Raw(
          dateFieldName =>
            `to_char(${dateFieldName}, 'DD-MM-YYYY') = '${parsedDay}-${parsedMonth}-${year}'`,
        ),
      },
    });

    return appointments;
  }
}

export default AppointmentsRepository;
