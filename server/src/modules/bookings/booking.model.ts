import { Schema, model, models, type Document, type Model, type Types } from 'mongoose';

export const BOOKING_STATUS = ['CONFIRMED', 'CANCELLED'] as const;
export type BookingStatus = (typeof BOOKING_STATUS)[number];

export interface BookingDoc extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  event: Types.ObjectId;
  seats: number;
  status: BookingStatus;
  bookingCode: string;
  cancelledAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<BookingDoc>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    event: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
    seats: { type: Number, required: true, min: 1 },
    status: { type: String, enum: BOOKING_STATUS, default: 'CONFIRMED' },
    bookingCode: { type: String, required: true, unique: true },
    cancelledAt: { type: Date, default: null },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(_doc, ret) {
        const r = ret as unknown as Record<string, unknown>;
        r.id = r._id;
        delete r._id;
        delete r.__v;
        return r;
      },
    },
  },
);

// "My bookings", newest first; plus event-scoped lookups.
bookingSchema.index({ user: 1, createdAt: -1 });
bookingSchema.index({ event: 1 });

export const Booking: Model<BookingDoc> =
  (models.Booking as Model<BookingDoc>) || model<BookingDoc>('Booking', bookingSchema);
