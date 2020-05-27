import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import multer from 'multer';

import ensureAuthentication from '@modules/users/infra/middlewares/ensureAuthentication';

import storageConfig from '@config/storage';
import UsersControllers from '../controllers/UsersController';
import UserAvatarController from '../controllers/UserAvatarController';

const usersRouter = Router();
const upload = multer(storageConfig.multer);
const usersControllers = new UsersControllers();
const userAvatarController = new UserAvatarController();

/**
 * Here we used the authentication check middleware directly in the routes
 * because we need the user creation to be available to logged out users.
 */

/**
 * User creation
 * POST http://base_url/users/
 */
usersRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
  }),
  usersControllers.create,
);

/**
 * Avatar update
 * PATCH http://base_url/users/avatar
 * First it will check if the user is logged, then it will upload the file and after it will execute the logic defined in the route
 */
usersRouter.patch(
  '/avatar',
  ensureAuthentication,
  upload.single('avatar'),
  userAvatarController.update,
);

export default usersRouter;
