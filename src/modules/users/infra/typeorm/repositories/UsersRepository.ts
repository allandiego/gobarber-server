/**
 * `typeorm` provides an default repository with commom methods.
 * But as we have an interface describing all the methods we need, we
 * code it bellow
 */

import { Repository, getRepository } from 'typeorm';
import IUserRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IFindAllProvidersDTO from '@modules/users/dtos/IFindAllProvidersDTO';
import User from '../entities/Users';

export default class UsersRepository implements IUserRepository {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = getRepository(User);
  }

  public async create({
    name,
    email,
    password,
  }: ICreateUserDTO): Promise<User> {
    const user = this.ormRepository.create({ name, email, password });

    await this.ormRepository.save(user);

    return user;
  }

  public async update(user: User): Promise<User> {
    return this.ormRepository.save(user);
  }

  public async findById(id: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne(id);

    return user;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne({
      where: { email },
    });

    return user;
  }

  public async FindAllProviders({
    except_user_id,
  }: IFindAllProvidersDTO): Promise<User[]> {
    const users = await this.ormRepository.find();

    if (except_user_id) {
      return users.filter(user => user.id !== except_user_id);
    }

    return users;
  }
}
