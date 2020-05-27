/**
 * Service classes execute one and only one business logic action
 */

import User from '@modules/users/infra/typeorm/entities/Users';

import authConfig from '@config/auth';
import { sign } from 'jsonwebtoken';

import AppError from '@shared/errors/AppError';
import { injectable, inject } from 'tsyringe';

import IUserRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

/**
 * These interfaces are named as Request and Response to be generic, but it can
 * lead to confusion with the ones defined by Express (IMO).
 */

// What this service is expecting
interface IRequest {
  email: string;
  password: string;
}

// What it will return
interface IResponse {
  user: User;
  token: string;
}

@injectable()
class AuthenticateUserService {
  // typescript hack to automatically create an private property with this name and type
  constructor(
    @inject('UsersRepository') private usersRepository: IUserRepository,
    @inject('HashProvider') private hashProvider: IHashProvider,
  ) {}

  // It is usual to name this method as `execute` or `run` but you can
  // name it however you want
  public async execute({ email, password }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError('Incorrect email/password combination', 401);
    }

    const passwordMatched = await this.hashProvider.compare(
      password,
      user.password,
    );

    if (!passwordMatched) {
      throw new AppError('Incorrect email/password combination', 401);
    }

    const token = sign({}, authConfig.jwt.secret, {
      subject: user.id,
      expiresIn: authConfig.jwt.expiresIn,
    });

    delete user.password;

    return { user, token };
  }
}

export default AuthenticateUserService;
