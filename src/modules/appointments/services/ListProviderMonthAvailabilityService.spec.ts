import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderMonthAvailabilityService from './ListProviderMonthAvailabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let ListProviderMonthAvailability: ListProviderMonthAvailabilityService;

describe('Providers availability per month', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    ListProviderMonthAvailability = new ListProviderMonthAvailabilityService(
      fakeAppointmentsRepository,
    );
  });

  /**
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   */

  it('should be able to list the availability in a month of a provider', async () => {
    // 4 = may in computer friendly

    await fakeAppointmentsRepository.create({
      provider_id: 'provider-id-01',
      client_id: 'client-id-1',
      date: new Date(2020, 4, 16, 8, 0, 0),
    });
    await fakeAppointmentsRepository.create({
      provider_id: 'provider-id-01',
      client_id: 'client-id-1',
      date: new Date(2020, 4, 16, 9, 0, 0),
    });
    await fakeAppointmentsRepository.create({
      provider_id: 'provider-id-01',
      client_id: 'client-id-1',
      date: new Date(2020, 4, 16, 10, 0, 0),
    });
    await fakeAppointmentsRepository.create({
      provider_id: 'provider-id-01',
      client_id: 'client-id-1',
      date: new Date(2020, 4, 16, 11, 0, 0),
    });
    await fakeAppointmentsRepository.create({
      provider_id: 'provider-id-01',
      client_id: 'client-id-1',
      date: new Date(2020, 4, 16, 12, 0, 0),
    });
    await fakeAppointmentsRepository.create({
      provider_id: 'provider-id-01',
      client_id: 'client-id-1',
      date: new Date(2020, 4, 16, 13, 0, 0),
    });
    await fakeAppointmentsRepository.create({
      provider_id: 'provider-id-01',
      client_id: 'client-id-1',
      date: new Date(2020, 4, 16, 14, 0, 0),
    });
    await fakeAppointmentsRepository.create({
      provider_id: 'provider-id-01',
      client_id: 'client-id-1',
      date: new Date(2020, 4, 16, 15, 0, 0),
    });
    await fakeAppointmentsRepository.create({
      provider_id: 'provider-id-01',
      client_id: 'client-id-1',
      date: new Date(2020, 4, 16, 16, 0, 0),
    });
    await fakeAppointmentsRepository.create({
      provider_id: 'provider-id-01',
      client_id: 'client-id-1',
      date: new Date(2020, 4, 16, 17, 0, 0),
    });

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

    // 5 = may in human friendly
    const availability = await ListProviderMonthAvailability.execute({
      provider_id: 'provider-id-01',
      month: 5,
      year: 2020,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { day: 16, available: false },
        { day: 17, available: true },
      ]),
    );
  });
});
