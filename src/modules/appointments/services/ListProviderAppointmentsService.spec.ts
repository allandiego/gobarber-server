import FakeCacheProvider from '@shared/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderAppointmentsService from './ListProviderAppointmentsService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderAppointments: ListProviderAppointmentsService;
let fakeCacheProvider: FakeCacheProvider;

describe('Providers appointments in a day', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeCacheProvider = new FakeCacheProvider();

    listProviderAppointments = new ListProviderAppointmentsService(
      fakeAppointmentsRepository,
      fakeCacheProvider,
    );
  });

  /**
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   */

  it('should be able to list the appointments for a provider in a specific day', async () => {
    // 4 = may in computer friendly
    const appointment1 = await fakeAppointmentsRepository.create({
      provider_id: 'provider-id-01',
      client_id: 'client-id-1',
      date: new Date(2020, 4, 17, 9, 0, 0),
    });
    const appointment2 = await fakeAppointmentsRepository.create({
      provider_id: 'provider-id-01',
      client_id: 'client-id-2',
      date: new Date(2020, 4, 17, 13, 0, 0),
    });
    const appointment3 = await fakeAppointmentsRepository.create({
      provider_id: 'provider-id-01',
      client_id: 'client-id-3',
      date: new Date(2020, 4, 17, 17, 0, 0),
    });

    // 5 = may in human friendly
    const appointments = await listProviderAppointments.execute({
      provider_id: 'provider-id-01',
      day: 17,
      month: 5,
      year: 2020,
    });

    expect(appointments).toEqual(
      expect.arrayContaining([appointment1, appointment2, appointment3]),
    );
  });
});
