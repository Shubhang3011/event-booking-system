import type { EventCategory, EventItem } from './types';

const u = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=70`;

/** Sensible per-category cover when an event has no image of its own. */
const CATEGORY_IMAGES: Record<EventCategory, string> = {
  Music: u('photo-1470229722913-7c0e2dbbafd3'),
  Technology: u('photo-1540575467063-178a50c2df87'),
  Arts: u('photo-1531058020387-3be344556be6'),
  Business: u('photo-1556761175-5973dc0f32e7'),
  Sports: u('photo-1452626038306-9aae5e071dd3'),
  'Food & Drink': u('photo-1414235077428-338989a2e8c0'),
  Community: u('photo-1523580494863-6f3031224c94'),
  Theatre: u('photo-1503095396549-807759245b35'),
  Wellness: u('photo-1506126613408-eca07ce68773'),
};

export function coverImage(event: Pick<EventItem, 'imageUrl' | 'category'>): string {
  return event.imageUrl || CATEGORY_IMAGES[event.category] || CATEGORY_IMAGES.Music;
}

export function categoryImage(category: EventCategory): string {
  return CATEGORY_IMAGES[category] ?? CATEGORY_IMAGES.Music;
}
