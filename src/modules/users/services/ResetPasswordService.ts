/**
 * Service classes execute one and only one business logic action
 */

import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';

import { addHours, isAfter } from 'date-fns';
import IUserRepository from '../repositories/IUsersRepository';
import IUserTokensRepository from '../repositories/IUserTokensRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface IRequest {
  token: string;
  password: string;
}

@injectable()
export default class ResetPasswordService {
  // typescript hack to automatically create an private property with this name and type
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUserRepository,

    @inject('UserTokensRepository')
    private userTokenRepository: IUserTokensRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({ token, password }: IRequest): Promise<void> {
    const userToken = await this.userTokenRepository.findByToken(token);
    if (!userToken) {
      throw new AppError('Token not found');
    }

    const user = await this.usersRepository.findById(userToken.user_id);
    if (!user) {
      throw new AppError('User does not exists');
    }

    const tokenCreatedAt = userToken.created_at;
    const tokenExpiresAt = addHours(tokenCreatedAt, 2);
    if (isAfter(Date.now(), tokenExpiresAt)) {
      throw new AppError('Token expired');
    }

    user.password = await this.hashProvider.generate(password);

    await this.usersRepository.update(user);
  }
}
