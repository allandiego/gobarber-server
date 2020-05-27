import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import SendForgotPasswordEmailService from '@modules/users/services/SendForgotPasswordEmailService';
import FakeMailProvider from '@shared/providers/MailProvider/fakes/FakeMailProvider';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';

let fakeUserRepository: FakeUsersRepository;
let fakeMailProvider: FakeMailProvider;
let fakeUserTokensRepository: FakeUserTokensRepository;
let sendForgotPasswordEmail: SendForgotPasswordEmailService;

describe('Forgot password email delivery', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUsersRepository();
    fakeMailProvider = new FakeMailProvider();
    fakeUserTokensRepository = new FakeUserTokensRepository();

    sendForgotPasswordEmail = new SendForgotPasswordEmailService(
      fakeUserRepository,
      fakeMailProvider,
      fakeUserTokensRepository,
    );
  });

  /**
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   */

  it('should be able to send the email to recover the password', async () => {
    const fakeSendMailFunction = jest.spyOn(fakeMailProvider, 'sendMail');

    await fakeUserRepository.create({
      name: 'John',
      email: 'john@toe.net',
      password: 'hashedPassword',
    });

    await sendForgotPasswordEmail.execute({
      email: 'john@toe.net',
    });

    expect(fakeSendMailFunction).toHaveBeenCalled();
  });

  /**
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   */

  it('should be NOT send the email to a non-existing user', async () => {
    await expect(
      sendForgotPasswordEmail.execute({
        email: 'john@toe.net',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  /**
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   */

  it('should generate a user token', async () => {
    const fakeGenerateTokenFunction = jest.spyOn(
      fakeUserTokensRepository,
      'generate',
    );

    const user = await fakeUserRepository.create({
      name: 'John',
      email: 'john@toe.net',
      password: 'hashedPassword',
    });

    await sendForgotPasswordEmail.execute({
      email: 'john@toe.net',
    });

    expect(fakeGenerateTokenFunction).toHaveBeenCalledWith(user.id);
  });
});
