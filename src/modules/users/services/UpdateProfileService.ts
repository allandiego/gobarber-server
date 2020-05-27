/**
 * Service classes execute one and only one business logic action
 */

import AppError from '@shared/errors/AppError';
import { injectable, inject } from 'tsyringe';

import User from '@modules/users/infra/typeorm/entities/Users';
import IUserRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface IRequest {
  user_id: string;
  name: string;
  email: string;
  password?: string;
  old_password?: string;
}

@injectable()
export default class UpdateprofileService {
  // typescript hack to automatically create an private property with this name and type
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUserRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    user_id,
    name,
    email,
    password,
    old_password,
  }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found');
    }

    const emailExists = await this.usersRepository.findByEmail(email);

    if (emailExists && emailExists.id !== user.id) {
      throw new AppError(
        'This email address is already in use by another user',
      );
    }

    user.name = name;
    user.email = email;

    if (password && !old_password) {
      throw new AppError('You need to provide your old password as well');
    }

    if (password && old_password) {
      const checkPassword = await this.hashProvider.compare(
        old_password,
        user.password,
      );

      if (!checkPassword) {
        throw new AppError('Your old password is wrong');
      }
    }

    if (password) {
      user.password = await this.hashProvider.generate(password);
    }

    return this.usersRepository.update(user);
  }
}
