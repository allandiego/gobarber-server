/**
 * Service classes execute one and only one business logic action
 */

import User from '@modules/users/infra/typeorm/entities/Users';

import AppError from '@shared/errors/AppError';
import { injectable, inject } from 'tsyringe';
import IStorageProvider from '@shared/providers/StorageProvider/models/IStorageProvider';
import IUserRepository from '../repositories/IUsersRepository';

interface IRequest {
  userId: string;
  avatarFilename: string;
}

@injectable()
export default class UpdateUserAvatarService {
  // typescript hack to automatically create an private property with this name and type
  constructor(
    @inject('UsersRepository') private usersRepository: IUserRepository,
    @inject('StorageProvider') private storageProvider: IStorageProvider,
  ) {}

  public async execute({ userId, avatarFilename }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new AppError('Only existing users can change their avatar', 401);
    }

    if (user.avatar) {
      await this.storageProvider.delete(user.avatar);
    }

    const fileName = await this.storageProvider.save(avatarFilename);

    user.avatar = fileName;

    await this.usersRepository.update(user);

    delete user.password;

    return user;
  }
}
