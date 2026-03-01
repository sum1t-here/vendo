import { z } from 'zod';

export const cartItemSchema = z.object({
  id: z.coerce.number(),
  name: z.string().min(1),
  price: z.coerce.number().nonnegative(),
  image: z.string().min(1),
  slug: z.string().min(1),
  quantity: z.coerce.number().int().min(1).max(50),

  variantId: z.number().optional(),
  variantValue: z.string().optional(),
});

export const cartSchema = z.object({
  items: z.array(cartItemSchema).max(100),
});

export type CartInput = z.infer<typeof cartSchema>;
