import { Router } from 'express';
import { asyncHandler } from '../../lib/asyncHandler';
import { validate } from '../../middleware/validate';
import * as eventController from './event.controller';
import { eventIdParamSchema, listEventsQuerySchema } from './event.schema';

const router = Router();

router.get('/', validate({ query: listEventsQuerySchema }), asyncHandler(eventController.list));
router.get('/:id', validate({ params: eventIdParamSchema }), asyncHandler(eventController.detail));

export const eventRouter = router;
