import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthentication from '@modules/users/infra/middlewares/ensureAuthentication';
import AppointmentsController from '../controllers/AppointmentsController';

const appointmentsRouter = Router();
const appointmentsController = new AppointmentsController();

// By setting the middleware at this point and in this way, we are setting it to run in all routes
appointmentsRouter.use(ensureAuthentication);

/**
 * Appointments listing
 * GET http://base_url/appointments/
 */
appointmentsRouter.get('/', appointmentsController.index);

/**
 * Appointment creation
 * POST http://base_url/appointments/
 */
appointmentsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      provider_id: Joi.string().uuid().required(),
      date: Joi.date(),
    },
  }),
  appointmentsController.create,
);

export default appointmentsRouter;
