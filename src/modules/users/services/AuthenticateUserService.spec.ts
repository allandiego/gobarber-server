import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import CreateUserService from '@modules/users/services/CreateUserService';
import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';
import FakeCacheProvider from '@shared/providers/CacheProvider/fakes/FakeCacheProvider';

let fakeUserRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let CreateUser: CreateUserService;
let AuthenticateUser: AuthenticateUserService;
let fakeCacheProvider: FakeCacheProvider;

describe('User authentication', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeCacheProvider = new FakeCacheProvider();

    CreateUser = new CreateUserService(
      fakeUserRepository,
      fakeHashProvider,
      fakeCacheProvider,
    );

    AuthenticateUser = new AuthenticateUserService(
      fakeUserRepository,
      fakeHashProvider,
    );
  });

  /**
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   */

  it('should be able to authenticate', async () => {
    const user = await CreateUser.execute({
      name: 'John Toe',
      email: 'john@toe.net',
      password: '123123',
    });

    const response = await AuthenticateUser.execute({
      email: 'john@toe.net',
      password: '123123',
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  /**
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   */

  it('should NOT allow a user to authenticate with the wrong password', async () => {
    await CreateUser.execute({
      name: 'John Toe',
      email: 'john@toe.net',
      password: '123123',
    });

    await expect(
      AuthenticateUser.execute({
        email: 'john@toe.net',
        password: 'asdasd',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  /**
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   */

  describe('User authentication', () => {
    beforeEach(() => {
      fakeUserRepository = new FakeUsersRepository();
      fakeHashProvider = new FakeHashProvider();
      AuthenticateUser = new AuthenticateUserService(
        fakeUserRepository,
        fakeHashProvider,
      );
    });

    /**
     * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     */

    it('should NOT allow unregistered users to authenticate', async () => {
      await expect(
        AuthenticateUser.execute({
          email: 'john@toe.net',
          password: '123123',
        }),
      ).rejects.toBeInstanceOf(AppError);
    });
  });
});
