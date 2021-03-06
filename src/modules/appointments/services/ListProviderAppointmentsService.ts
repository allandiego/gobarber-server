/**
 * Service classes execute one and only one business logic action
 */

import { injectable, inject } from 'tsyringe';

import ICacheProvider from '@shared/providers/CacheProvider/models/ICacheProvider';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';
import Appointment from '../infra/typeorm/entities/Appointment';

interface IRequest {
  provider_id: string;
  day: number;
  month: number;
  year: number;
}

@injectable()
export default class ListProviderAppointmentsService {
  // typescript hack to automatically create an private property with this name and type
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    provider_id,
    day,
    month,
    year,
  }: IRequest): Promise<Appointment[]> {
    const cacheKey = `provider-appointments:${provider_id}:${year}:${month}:${day}`;

    let appointments = await this.cacheProvider.get<Appointment[]>(cacheKey);

    if (!appointments) {
      appointments = await this.appointmentsRepository.findAvailabilityInDayForProvider(
        { provider_id, day, month, year },
      );

      await this.cacheProvider.set(cacheKey, appointments);
    }

    return appointments;
  }
}
