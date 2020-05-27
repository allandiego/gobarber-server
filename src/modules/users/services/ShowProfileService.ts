/**
 * Service classes execute one and only one business logic action
 */

import User from '@modules/users/infra/typeorm/entities/Users';

import AppError from '@shared/errors/AppError';
import { injectable, inject } from 'tsyringe';
import IUserRepository from '../repositories/IUsersRepository';

interface IRequest {
  user_id: string;
}

@injectable()
export default class ShowProfileService {
  // typescript hack to automatically create an private property with this name and type
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUserRepository,
  ) {}

  public async execute({ user_id }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found');
    }

    return user;
  }
}
