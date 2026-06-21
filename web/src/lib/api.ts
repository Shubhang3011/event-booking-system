import axios from 'axios';
import type { Booking, EventCategory, EventItem, Pagination, User } from './types';

/**
 * Single axios instance. `withCredentials` sends the httpOnly auth cookie on
 * every request. In dev the baseURL is "/api" (Vite proxies it to the backend);
 * in production set VITE_API_URL to the deployed API origin.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
});

export interface ApiError {
  message: string;
  code: string;
  status: number;
  details?: { field: string; message: string }[];
}

/** Normalise any thrown value into a predictable ApiError. */
export function toApiError(err: unknown): ApiError {
  if (axios.isAxiosError(err)) {
    const body = err.response?.data?.error;
    return {
      message: body?.message ?? err.message ?? 'Something went wrong',
      code: body?.code ?? 'NETWORK_ERROR',
      status: err.response?.status ?? 0,
      details: body?.details,
    };
  }
  return {
    message: err instanceof Error ? err.message : 'Something went wrong',
    code: 'UNKNOWN',
    status: 0,
  };
}

// ---- Endpoints -----------------------------------------------------------

export interface Credentials {
  email: string;
  password: string;
}
export interface RegisterPayload extends Credentials {
  name: string;
}

export const authApi = {
  register: (body: RegisterPayload) => api.post('/auth/register', body).then((r) => r.data.data as User),
  login: (body: Credentials) => api.post('/auth/login', body).then((r) => r.data.data as User),
  logout: () => api.post('/auth/logout').then(() => undefined),
  me: () =>
    api
      .get('/auth/me')
      .then((r) => r.data.data as User)
      .catch((err: unknown) => {
        // Not signed in is an expected state, not an error.
        if (axios.isAxiosError(err) && err.response?.status === 401) return null;
        throw err;
      }),
};

export interface ListEventsParams {
  search?: string;
  category?: EventCategory;
  city?: string;
  when?: 'upcoming' | 'past' | 'all';
  sort?: 'date' | '-date' | 'seats' | '-seats' | 'newest';
  page?: number;
  limit?: number;
}

export const eventsApi = {
  list: (params: ListEventsParams) =>
    api.get('/events', { params }).then((r) => r.data as { data: EventItem[]; pagination: Pagination }),
  get: (id: string) => api.get(`/events/${id}`).then((r) => r.data.data as EventItem),
};

export interface CreateBookingPayload {
  eventId: string;
  seats: number;
}

export const bookingsApi = {
  list: (status?: 'CONFIRMED' | 'CANCELLED') =>
    api.get('/bookings', { params: status ? { status } : undefined }).then((r) => r.data.data as Booking[]),
  create: (body: CreateBookingPayload) => api.post('/bookings', body).then((r) => r.data.data as Booking),
  cancel: (id: string) => api.patch(`/bookings/${id}/cancel`).then((r) => r.data.data as Booking),
};

export default api;
