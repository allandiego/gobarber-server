/**
 * Service classes execute one and only one business logic action
 */

import User from '@modules/users/infra/typeorm/entities/Users';

import AppError from '@shared/errors/AppError';
import { injectable, inject } from 'tsyringe';
import IUserRepository from '@modules/users/repositories/IUsersRepository';
import ICacheProvider from '@shared/providers/CacheProvider/models/ICacheProvider';

interface IRequest {
  user_id: string;
}

@injectable()
export default class ListProvidersService {
  // typescript hack to automatically create an private property with this name and type
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUserRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ user_id }: IRequest): Promise<User[]> {
    let users = await this.cacheProvider.get<User[]>(
      `providers-list:${user_id}`,
    );

    if (!users) {
      users = await this.usersRepository.FindAllProviders({
        except_user_id: user_id,
      });

      await this.cacheProvider.set(`providers-list:${user_id}`, users);
    }

    return users;
  }
}
