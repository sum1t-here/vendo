import z from 'zod';

export const contactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be at most 100 characters'),
  email: z.email('Invalid email'),
  message: z.string().min(1, 'Message is required').max(1000, 'Message must be at most 1000 characters'),
});
