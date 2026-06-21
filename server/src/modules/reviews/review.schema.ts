import { z } from 'zod';

export const createReviewSchema = z.object({
  rating: z.coerce.number().int('Pick a rating').min(1, 'Pick a rating').max(5),
  comment: z.string().trim().max(1000).optional().default(''),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
