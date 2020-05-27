import AppError from '@shared/errors/AppError';
import FakeCacheProvider from '@shared/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import FakeNotificationsRepository from '../../notifications/repositories/fakes/FakeNotificationsRepository';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeNotificationsRepository: FakeNotificationsRepository;
let createAppointment: CreateAppointmentService;
let fakeCacheProvider: FakeCacheProvider;

describe('Appointment creation', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeNotificationsRepository = new FakeNotificationsRepository();
    fakeCacheProvider = new FakeCacheProvider();

    createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
      fakeNotificationsRepository,
      fakeCacheProvider,
    );
  });

  /**
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   */

  it('should be able to create a new appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 16, 13).getTime();
    });

    const appointment = await createAppointment.execute({
      date: new Date(2020, 4, 16, 15),
      provider_id: 'provider-id-1',
      client_id: 'client-id-1',
    });

    expect(appointment).toHaveProperty('id');
  });

  /**
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   */

  it('should NOT be able to create two appointments at the same date and time', async () => {
    jest.spyOn(Date, 'now').mockImplementation(() => {
      return new Date(2020, 4, 16, 13).getTime();
    });

    await createAppointment.execute({
      date: new Date(2020, 4, 16, 15),
      provider_id: 'provider-id-1',
      client_id: 'client-id-1',
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 16, 15),
        provider_id: 'provider-id-1',
        client_id: 'client-id-2',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  /**
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   */

  it('should NOT be able to create an appointment in a past date/time', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 16, 13).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 16, 12),
        provider_id: 'provider-id-1',
        client_id: 'client-id-1',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  /**
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   */

  it('should NOT be able to create an appointment if user and provider are the same person', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 16, 13).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 16, 15),
        provider_id: 'id-1',
        client_id: 'id-1',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  /**
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   */

  it('should NOT be able to create an appointment before 8h or after 17h', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 16, 13).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 17, 7),
        provider_id: 'provier-id-1',
        client_id: 'client-id-1',
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 16, 18),
        provider_id: 'provider-id-1',
        client_id: 'client-id-1',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
