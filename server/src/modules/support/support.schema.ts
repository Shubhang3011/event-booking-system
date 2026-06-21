import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().trim().min(2, 'Tell us your name').max(120),
  email: z.string().trim().toLowerCase().email('Enter a valid email'),
  message: z.string().trim().min(10, 'Tell us a little more').max(5000),
});

export const newsletterSchema = z.object({
  email: z.string().trim().toLowerCase().email('Enter a valid email'),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type NewsletterInput = z.infer<typeof newsletterSchema>;
