import type { Request, Response } from 'express';
import { sendData, sendList } from '../../lib/http';
import * as eventService from './event.service';
import type { ListEventsQuery } from './event.schema';

export async function list(req: Request, res: Response): Promise<void> {
  const query = req.valid.query as ListEventsQuery;
  const { events, total } = await eventService.listEvents(query);
  const totalPages = Math.max(1, Math.ceil(total / query.limit));
  sendList(res, events, { page: query.page, limit: query.limit, total, totalPages });
}

export async function detail(req: Request, res: Response): Promise<void> {
  const { id } = req.valid.params as { id: string };
  const event = await eventService.getEventById(id);
  sendData(res, event);
}
