import { Router } from 'express';
import { asyncHandler } from '../../lib/asyncHandler';
import { requireAuth } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import * as bookingController from './booking.controller';
import {
  bookingIdParamSchema,
  createBookingSchema,
  listBookingsQuerySchema,
} from './booking.schema';

const router = Router();

// Every booking route requires an authenticated user.
router.use(requireAuth);

router.post('/', validate({ body: createBookingSchema }), asyncHandler(bookingController.create));
router.get('/', validate({ query: listBookingsQuerySchema }), asyncHandler(bookingController.list));
router.patch(
  '/:id/cancel',
  validate({ params: bookingIdParamSchema }),
  asyncHandler(bookingController.cancel),
);

export const bookingRouter = router;
