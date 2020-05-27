/**
 * This repository is similar to the original one in `infra/typeorm/repositories`
 * but makes no real connection to the database
 */

import { uuid } from 'uuidv4';
import UserToken from '@modules/users/infra/typeorm/entities/UserToken';
import IUserTokensRepository from '../IUserTokensRepository';

export default class FakeUserTokensRepository implements IUserTokensRepository {
  private userTokens: UserToken[] = [];

  public async generate(user_id: string): Promise<UserToken> {
    const userToken = new UserToken();

    userToken.id = uuid();
    userToken.token = uuid();
    userToken.user_id = user_id;
    userToken.created_at = new Date();
    userToken.updated_at = new Date();

    this.userTokens.push(userToken);

    return userToken;
  }

  public async findByToken(token: string): Promise<UserToken | undefined> {
    const userToken = await this.userTokens.find(item => item.token === token);

    return userToken;
  }
}
