import { Router } from 'express';
import { asyncHandler } from '../../lib/asyncHandler';
import { validate } from '../../middleware/validate';
import * as supportController from './support.controller';
import { contactSchema, newsletterSchema } from './support.schema';

const router = Router();

router.post('/contact', validate({ body: contactSchema }), asyncHandler(supportController.contact));
router.post('/newsletter', validate({ body: newsletterSchema }), asyncHandler(supportController.subscribe));

export const supportRouter = router;
