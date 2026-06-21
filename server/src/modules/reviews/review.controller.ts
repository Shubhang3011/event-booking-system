import type { Request, Response } from 'express';
import { sendData } from '../../lib/http';
import * as reviewService from './review.service';
import type { CreateReviewInput } from './review.schema';

export async function list(req: Request, res: Response): Promise<void> {
  const { id } = req.valid.params as { id: string };
  sendData(res, await reviewService.listForEvent(id));
}

export async function upsert(req: Request, res: Response): Promise<void> {
  const { id } = req.valid.params as { id: string };
  await reviewService.upsertReview(req.userId as string, id, req.valid.body as CreateReviewInput);
  sendData(res, { ok: true }, 201);
}

export async function remove(req: Request, res: Response): Promise<void> {
  const { id } = req.valid.params as { id: string };
  await reviewService.deleteReview(req.userId as string, id);
  sendData(res, { ok: true });
}
