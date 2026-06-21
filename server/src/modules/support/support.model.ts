import { Schema, model, models, type Document, type Model } from 'mongoose';

export interface MessageDoc extends Document {
  name: string;
  email: string;
  message: string;
  createdAt: Date;
}

const messageSchema = new Schema<MessageDoc>(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, trim: true, lowercase: true },
    message: { type: String, required: true, trim: true, maxlength: 5000 },
  },
  { timestamps: true },
);

export const Message: Model<MessageDoc> =
  (models.Message as Model<MessageDoc>) || model<MessageDoc>('Message', messageSchema);

export interface SubscriberDoc extends Document {
  email: string;
  createdAt: Date;
}

const subscriberSchema = new Schema<SubscriberDoc>(
  {
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  },
  { timestamps: true },
);

export const Subscriber: Model<SubscriberDoc> =
  (models.Subscriber as Model<SubscriberDoc>) || model<SubscriberDoc>('Subscriber', subscriberSchema);
