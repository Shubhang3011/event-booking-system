import { Schema, model, models, type Document, type Model, type Types } from 'mongoose';

export interface ReviewDoc extends Document {
  _id: Types.ObjectId;
  event: Types.ObjectId;
  user: Types.ObjectId;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<ReviewDoc>(
  {
    event: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, trim: true, maxlength: 1000, default: '' },
  },
  {
    timestamps: true,
    toJSON: {
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

// One review per user per event.
reviewSchema.index({ event: 1, user: 1 }, { unique: true });
reviewSchema.index({ event: 1, createdAt: -1 });

export const Review: Model<ReviewDoc> =
  (models.Review as Model<ReviewDoc>) || model<ReviewDoc>('Review', reviewSchema);
