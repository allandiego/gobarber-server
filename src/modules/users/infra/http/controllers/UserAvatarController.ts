/**
 * Conventionally when creating REST APIs, controllers have at most five methods:
 * -> index, show, create, update, delete
 *
 * This controller was created because we wanted to update only the avatar,
 * not all user data
 */

import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';

export default class UserAvatarController {
  public async update(request: Request, response: Response): Promise<Response> {
    const updateUserAvatar = container.resolve(UpdateUserAvatarService);

    const user = await updateUserAvatar.execute({
      userId: request.user.id,
      avatarFilename: request.file.filename,
    });

    return response.json({ user: classToClass(user) });
  }
}
