import { Router } from 'express';
import { asyncHandler } from '../../lib/asyncHandler';
import { requireAuth } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import * as reviewController from '../reviews/review.controller';
import { createReviewSchema } from '../reviews/review.schema';
import * as eventController from './event.controller';
import {
  createEventSchema,
  eventIdParamSchema,
  listEventsQuerySchema,
  updateEventSchema,
} from './event.schema';

const router = Router();

router.get('/', validate({ query: listEventsQuerySchema }), asyncHandler(eventController.list));

// Static segments must be registered before "/:id".
router.get('/saved', requireAuth, asyncHandler(eventController.listSaved));
router.get('/mine', requireAuth, asyncHandler(eventController.mine));
router.post('/', requireAuth, validate({ body: createEventSchema }), asyncHandler(eventController.create));

router.get('/:id', validate({ params: eventIdParamSchema }), asyncHandler(eventController.detail));
router.patch(
  '/:id',
  requireAuth,
  validate({ params: eventIdParamSchema, body: updateEventSchema }),
  asyncHandler(eventController.update),
);
router.delete('/:id', requireAuth, validate({ params: eventIdParamSchema }), asyncHandler(eventController.remove));

// Bookmark / un-bookmark an event.
router.post('/:id/save', requireAuth, validate({ params: eventIdParamSchema }), asyncHandler(eventController.save));
router.delete('/:id/save', requireAuth, validate({ params: eventIdParamSchema }), asyncHandler(eventController.unsave));

// Reviews.
router.get('/:id/reviews', validate({ params: eventIdParamSchema }), asyncHandler(reviewController.list));
router.post(
  '/:id/reviews',
  requireAuth,
  validate({ params: eventIdParamSchema, body: createReviewSchema }),
  asyncHandler(reviewController.upsert),
);
router.delete('/:id/reviews', requireAuth, validate({ params: eventIdParamSchema }), asyncHandler(reviewController.remove));

export const eventRouter = router;
