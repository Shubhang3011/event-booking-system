import type { Response } from 'express';

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/** Standard success envelope: `{ data, ...meta }`. */
export function sendData<T>(res: Response, data: T, status = 200): Response {
  return res.status(status).json({ data });
}

/** Standard list envelope: `{ data, pagination }`. */
export function sendList<T>(res: Response, data: T[], pagination: Pagination): Response {
  return res.status(200).json({ data, pagination });
}
