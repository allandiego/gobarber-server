import { Request, Response } from 'express';
import { container } from 'tsyringe';

import UpdateProfileService from '@modules/users/services/UpdateProfileService';
import ShowProfileService from '@modules/users/services/ShowProfileService';

import { classToClass } from 'class-transformer';

export default class ProfileController {
  public async show(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;

    const ShowProfile = container.resolve(ShowProfileService);

    const user = await ShowProfile.execute({ user_id });

    return response.json({ user: classToClass(user) });
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
    const { name, email, password, old_password } = request.body;

    const UpdateProfile = container.resolve(UpdateProfileService);

    const user = await UpdateProfile.execute({
      user_id,
      name,
      email,
      password,
      old_password,
    });

    return response.send({ user: classToClass(user) });
  }
}
