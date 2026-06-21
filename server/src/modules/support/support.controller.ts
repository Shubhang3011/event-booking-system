import type { Request, Response } from 'express';
import { sendData } from '../../lib/http';
import { Message, Subscriber } from './support.model';
import type { ContactInput, NewsletterInput } from './support.schema';

export async function contact(req: Request, res: Response): Promise<void> {
  await Message.create(req.valid.body as ContactInput);
  sendData(res, { message: "Thanks — we'll be in touch." }, 201);
}

export async function subscribe(req: Request, res: Response): Promise<void> {
  const { email } = req.valid.body as NewsletterInput;
  // Idempotent: subscribing twice is fine.
  await Subscriber.updateOne({ email }, { $setOnInsert: { email } }, { upsert: true });
  sendData(res, { message: "You're subscribed." }, 201);
}
