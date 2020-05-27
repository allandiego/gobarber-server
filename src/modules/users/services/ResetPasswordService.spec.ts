import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeMailProvider from '@shared/providers/MailProvider/fakes/FakeMailProvider';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import SendForgotPasswordEmailService from '@modules/users/services/SendForgotPasswordEmailService';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import ResetPasswordService from './ResetPasswordService';

let fakeHashProvider: FakeHashProvider;
let fakeMailProvider: FakeMailProvider;
let fakeUserRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let sendForgotPasswordEmail: SendForgotPasswordEmailService;
let resetPassword: ResetPasswordService;

describe('Forgot password email delivery', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUsersRepository();
    fakeMailProvider = new FakeMailProvider();
    fakeUserTokensRepository = new FakeUserTokensRepository();
    fakeHashProvider = new FakeHashProvider();

    sendForgotPasswordEmail = new SendForgotPasswordEmailService(
      fakeUserRepository,
      fakeMailProvider,
      fakeUserTokensRepository,
    );

    resetPassword = new ResetPasswordService(
      fakeUserRepository,
      fakeUserTokensRepository,
      fakeHashProvider,
    );
  });

  /**
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   */

  it('should be able to reset the password', async () => {
    const user = await fakeUserRepository.create({
      name: 'John',
      email: 'john@toe.net',
      password: '123456',
    });

    const generateHash = jest.spyOn(fakeHashProvider, 'generate');

    const { token } = await fakeUserTokensRepository.generate(user.id);

    await resetPassword.execute({ token, password: '123123' });

    const updatedUser = await fakeUserRepository.findById(user.id);

    expect(generateHash).toHaveBeenCalledWith('123123');
    expect(updatedUser?.password).toBe('123123');
  });

  /**
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   */

  it('should NOT be able to reset the password with non existent token', async () => {
    await expect(
      resetPassword.execute({
        token: 'non-existing-token',
        password: 'some-password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  /**
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   */

  it('should NOT be able to reset the password with non existent user', async () => {
    const { token } = await fakeUserTokensRepository.generate(
      'invalid-user-id',
    );

    await expect(
      resetPassword.execute({
        token,
        password: 'some-password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  /**
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   */

  it('should NOT be able to reset the password after 2 hours', async () => {
    const user = await fakeUserRepository.create({
      name: 'John',
      email: 'john@toe.net',
      password: 'old-password',
    });

    const { token } = await fakeUserTokensRepository.generate(user.id);

    // After this point, the next call to Date.now() will execute this function instead
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const currentDate = new Date();
      return currentDate.setHours(currentDate.getHours() + 3);
    });

    await expect(
      resetPassword.execute({
        token,
        password: 'new-password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
