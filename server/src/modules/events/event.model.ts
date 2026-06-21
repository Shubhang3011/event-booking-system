import { Schema, model, models, type Document, type Model, type Types } from 'mongoose';

export const EVENT_CATEGORIES = [
  'Music',
  'Technology',
  'Arts',
  'Business',
  'Sports',
  'Food & Drink',
  'Community',
  'Theatre',
  'Wellness',
] as const;

export type EventCategory = (typeof EVENT_CATEGORIES)[number];

export interface EventDoc extends Document {
  _id: Types.ObjectId;
  title: string;
  description: string;
  date: Date;
  venue: string;
  city: string;
  category: EventCategory;
  organizer: string;
  totalSeats: number;
  availableSeats: number;
  createdAt: Date;
  updatedAt: Date;
  // virtuals
  isPast: boolean;
  isSoldOut: boolean;
  status: 'past' | 'sold_out' | 'available';
}

const eventSchema = new Schema<EventDoc>(
  {
    title: { type: String, required: true, trim: true, maxlength: 140 },
    description: { type: String, required: true, trim: true, maxlength: 5000 },
    date: { type: Date, required: true },
    venue: { type: String, required: true, trim: true, maxlength: 160 },
    city: { type: String, required: true, trim: true, maxlength: 80 },
    category: { type: String, required: true, enum: EVENT_CATEGORIES },
    organizer: { type: String, required: true, trim: true, maxlength: 120 },
    totalSeats: { type: Number, required: true, min: 1 },
    availableSeats: {
      type: Number,
      required: true,
      min: 0,
      validate: {
        validator(this: EventDoc, value: number) {
          return value <= this.totalSeats;
        },
        message: 'availableSeats cannot exceed totalSeats',
      },
    },
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
    toObject: { virtuals: true },
  },
);

// Common access patterns: list upcoming events, filter by category.
eventSchema.index({ date: 1 });
eventSchema.index({ category: 1, date: 1 });

eventSchema.virtual('isPast').get(function (this: EventDoc) {
  return this.date.getTime() < Date.now();
});

eventSchema.virtual('isSoldOut').get(function (this: EventDoc) {
  return this.availableSeats <= 0;
});

eventSchema.virtual('status').get(function (this: EventDoc) {
  if (this.date.getTime() < Date.now()) return 'past';
  if (this.availableSeats <= 0) return 'sold_out';
  return 'available';
});

export const Event: Model<EventDoc> = (models.Event as Model<EventDoc>) || model<EventDoc>('Event', eventSchema);
