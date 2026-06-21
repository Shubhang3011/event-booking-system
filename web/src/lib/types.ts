export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

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

export type EventStatus = 'past' | 'sold_out' | 'available';

export interface EventItem {
  id: string;
  title: string;
  description: string;
  date: string;
  venue: string;
  city: string;
  category: EventCategory;
  organizer: string;
  totalSeats: number;
  availableSeats: number;
  isPast: boolean;
  isSoldOut: boolean;
  status: EventStatus;
  createdAt: string;
  updatedAt: string;
}

export type BookingStatus = 'CONFIRMED' | 'CANCELLED';

export interface Booking {
  id: string;
  user: string;
  event: EventItem;
  seats: number;
  status: BookingStatus;
  bookingCode: string;
  cancelledAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface FieldError {
  field: string;
  message: string;
}
