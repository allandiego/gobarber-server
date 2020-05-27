/**
 * Service classes execute one and only one business logic action
 */

import { injectable, inject } from 'tsyringe';

import { getHours, isAfter } from 'date-fns';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
  provider_id: string;
  day: number;
  month: number;
  year: number;
}

// Another way to declare the structure of the data
type IResponse = Array<{
  hour: number;
  available: boolean;
}>;

@injectable()
export default class ListProviderDayAvailabilityService {
  // typescript hack to automatically create an private property with this name and type
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({
    provider_id,
    day,
    month,
    year,
  }: IRequest): Promise<IResponse> {
    const appointments = await this.appointmentsRepository.findAvailabilityInDayForProvider(
      {
        provider_id,
        day,
        month,
        year,
      },
    );

    const startHour = 8;

    // array from 8 to 17
    const eachHourArray = Array.from(
      { length: 10 },
      (_, index) => index + startHour,
    );

    const currentDateTime = new Date(Date.now());

    const availability = eachHourArray.map(hour => {
      const hasAppointment = appointments.find(
        appointment => getHours(appointment.date) === hour,
      );

      const compareDateTime = new Date(year, month - 1, day, hour);

      // We can not schedule an appointment in the past
      return {
        hour,
        available: !hasAppointment && isAfter(compareDateTime, currentDateTime),
      };
    });

    return availability;
  }
}
