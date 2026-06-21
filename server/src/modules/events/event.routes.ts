import { Router } from 'express';
import { asyncHandler } from '../../lib/asyncHandler';
import { requireAuth } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import * as eventController from './event.controller';
import { eventIdParamSchema, listEventsQuerySchema } from './event.schema';

const router = Router();

router.get('/', validate({ query: listEventsQuerySchema }), asyncHandler(eventController.list));
// Must come before "/:id" so "saved" isn't treated as an id.
router.get('/saved', requireAuth, asyncHandler(eventController.listSaved));
router.get('/:id', validate({ params: eventIdParamSchema }), asyncHandler(eventController.detail));

// Bookmark / un-bookmark an event.
router.post('/:id/save', requireAuth, validate({ params: eventIdParamSchema }), asyncHandler(eventController.save));
router.delete('/:id/save', requireAuth, validate({ params: eventIdParamSchema }), asyncHandler(eventController.unsave));

export const eventRouter = router;
