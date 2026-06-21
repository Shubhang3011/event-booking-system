import { Router } from 'express';
import { authRouter } from '../modules/auth/auth.routes';
import { bookingRouter } from '../modules/bookings/booking.routes';
import { eventRouter } from '../modules/events/event.routes';
import { supportRouter } from '../modules/support/support.routes';

const router = Router();

/** Liveness/readiness probe for load balancers and uptime checks. */
router.get('/health', (_req, res) => {
  res.json({
    data: {
      status: 'ok',
      uptime: Math.round(process.uptime()),
      timestamp: new Date().toISOString(),
    },
  });
});

router.use('/auth', authRouter);
router.use('/events', eventRouter);
router.use('/bookings', bookingRouter);
router.use('/', supportRouter); // /contact, /newsletter

export const apiRouter = router;
