import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import UpdateprofileService from './UpdateProfileService';

let fakeHashProvider: FakeHashProvider;
let fakeUserRepository: FakeUsersRepository;
let updateProfile: UpdateprofileService;

describe('Avatar update', () => {
  beforeEach(() => {
    fakeHashProvider = new FakeHashProvider();
    fakeUserRepository = new FakeUsersRepository();

    updateProfile = new UpdateprofileService(
      fakeUserRepository,
      fakeHashProvider,
    );
  });

  /**
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   */

  it('should be able to update avatar', async () => {
    const user = await fakeUserRepository.create({
      name: 'User One',
      email: 'User@one.com',
      password: '111111',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'User #1',
      email: 'userone@email.com',
    });

    expect(updatedUser.name).toBe('User #1');
    expect(updatedUser.email).toBe('userone@email.com');
  });

  /**
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   */

  it('should NOT be able to update the email to an existing one', async () => {
    const user1 = await fakeUserRepository.create({
      name: 'User One',
      email: 'user@one.com',
      password: '111111',
    });

    await fakeUserRepository.create({
      name: 'User Two',
      email: 'user@two.com',
      password: '222222',
    });

    await expect(
      updateProfile.execute({
        user_id: user1.id,
        name: 'User One',
        email: 'user@two.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  /**
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   */

  it('should be able to update the password', async () => {
    const user = await fakeUserRepository.create({
      name: 'User One',
      email: 'user@one.com',
      password: '111111',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'User One',
      email: 'user@two.com',
      password: 'oneoneone',
      old_password: '111111',
    });

    expect(updatedUser.password).toBe('oneoneone');
  });

  /**
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   */

  it('should NOT be able to update the password without the old one', async () => {
    const user = await fakeUserRepository.create({
      name: 'User One',
      email: 'user@one.com',
      password: '111111',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'User One',
        email: 'user@one.com',
        password: 'oneoneone',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  /**
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   */

  it('should NOT be able to update the password if the old one is wrong', async () => {
    const user = await fakeUserRepository.create({
      name: 'User One',
      email: 'user@one.com',
      password: '111111',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'User One',
        email: 'user@one.com',
        password: 'oneoneone',
        old_password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  /**
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   */

  it('should NOT be able to update the profile if the user does not exists', async () => {
    await expect(
      updateProfile.execute({
        user_id: 'user-id',
        name: 'User One',
        email: 'user@one.com',
        password: 'oneoneone',
        old_password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
