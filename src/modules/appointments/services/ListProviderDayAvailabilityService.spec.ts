import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderDayAvailabilityService from './ListProviderDayAvailabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let ListProviderDayAvailability: ListProviderDayAvailabilityService;

describe('Providers availability per day', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    ListProviderDayAvailability = new ListProviderDayAvailabilityService(
      fakeAppointmentsRepository,
    );
  });

  /**
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   */

  it('should be able to list the availability of a provider in a day', async () => {
    // 4 = may in computer friendly
    await fakeAppointmentsRepository.create({
      provider_id: 'provider-id-01',
      client_id: 'client-id-1',
      date: new Date(2020, 4, 17, 8, 0, 0),
    });
    await fakeAppointmentsRepository.create({
      provider_id: 'provider-id-01',
      client_id: 'client-id-1',
      date: new Date(2020, 4, 17, 13, 0, 0),
    });
    await fakeAppointmentsRepository.create({
      provider_id: 'provider-id-01',
      client_id: 'client-id-1',
      date: new Date(2020, 4, 17, 17, 0, 0),
    });

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 17, 11).getTime();
    });

    // 5 = may in human friendly
    const availability = await ListProviderDayAvailability.execute({
      provider_id: 'provider-id-01',
      day: 17,
      month: 5,
      year: 2020,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { hour: 8, available: false },
        { hour: 9, available: false },
        { hour: 11, available: false },
        { hour: 13, available: false },
        { hour: 16, available: true },
        { hour: 17, available: false },
      ]),
    );
  });
});
