import type { Request, Response } from 'express';
import { sendData } from '../../lib/http';
import * as bookingService from './booking.service';
import type { CreateBookingInput, ListBookingsQuery } from './booking.schema';

export async function create(req: Request, res: Response): Promise<void> {
  const booking = await bookingService.createBooking(
    req.userId as string,
    req.valid.body as CreateBookingInput,
  );
  sendData(res, booking, 201);
}

export async function list(req: Request, res: Response): Promise<void> {
  const { status } = req.valid.query as ListBookingsQuery;
  const bookings = await bookingService.getUserBookings(req.userId as string, status);
  sendData(res, bookings);
}

export async function cancel(req: Request, res: Response): Promise<void> {
  const { id } = req.valid.params as { id: string };
  const booking = await bookingService.cancelBooking(req.userId as string, id);
  sendData(res, booking);
}
