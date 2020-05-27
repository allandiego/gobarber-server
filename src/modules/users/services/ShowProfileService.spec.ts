import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ShowProfileService from '@modules/users/services/ShowProfileService';

let fakeUserRepository: FakeUsersRepository;
let ShowProfile: ShowProfileService;

describe('Avatar update', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUsersRepository();

    ShowProfile = new ShowProfileService(fakeUserRepository);
  });

  /**
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   */

  it('should be able to show the profile', async () => {
    const user = await fakeUserRepository.create({
      name: 'John Toe',
      email: 'john@toe.net',
      password: '123123',
    });

    const profile = await ShowProfile.execute({
      user_id: user.id,
    });

    expect(profile.name).toBe(user.name);
  });

  /**
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   */

  it('should NOT be able to show a profile that dows not exists', async () => {
    expect(
      ShowProfile.execute({
        user_id: 'non-existing-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
