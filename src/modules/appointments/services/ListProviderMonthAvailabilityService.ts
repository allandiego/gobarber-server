/**
 * Service classes execute one and only one business logic action
 */

import { injectable, inject } from 'tsyringe';

import { getDaysInMonth, getDate } from 'date-fns';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
  provider_id: string;
  month: number;
  year: number;
}

// Another way to declare the structure of the data
type IResponse = Array<{
  day: number;
  available: boolean;
}>;

@injectable()
export default class ListProviderMonthAvailabilityService {
  // typescript hack to automatically create an private property with this name and type
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({
    provider_id,
    month,
    year,
  }: IRequest): Promise<IResponse> {
    const appointments = await this.appointmentsRepository.findAvailabilityInMonthForProvider(
      { provider_id, month, year },
    );

    const daysInMonth = getDaysInMonth(new Date(year, month - 1));

    // create an array with the days of the month
    const eachDayArray = Array.from(
      { length: daysInMonth },
      (_, index) => index + 1,
    );

    // foreach day in the month, check if there is an appointment
    const availability = eachDayArray.map(day => {
      const appointmentsInDay = appointments.filter(appointment => {
        return getDate(appointment.date) === day;
      });

      // 10 appointments in a day, from 8h to 17h.
      // If there is less than 10, then he is available
      return {
        day,
        available: appointmentsInDay.length < 10,
      };
    });

    return availability;
  }
}
