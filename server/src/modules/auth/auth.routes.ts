import { Router } from 'express';
import { asyncHandler } from '../../lib/asyncHandler';
import { requireAuth } from '../../middleware/auth';
import { authLimiter } from '../../middleware/rateLimit';
import { validate } from '../../middleware/validate';
import * as authController from './auth.controller';
import {
  changePasswordSchema,
  loginSchema,
  registerSchema,
  updateProfileSchema,
} from './auth.schema';

const router = Router();

router.post('/register', authLimiter, validate({ body: registerSchema }), asyncHandler(authController.register));
router.post('/login', authLimiter, validate({ body: loginSchema }), asyncHandler(authController.login));
router.post('/logout', asyncHandler(authController.logout));
router.get('/me', requireAuth, asyncHandler(authController.me));
router.patch('/profile', requireAuth, validate({ body: updateProfileSchema }), asyncHandler(authController.updateProfile));
router.patch('/password', requireAuth, validate({ body: changePasswordSchema }), asyncHandler(authController.changePassword));

export const authRouter = router;
