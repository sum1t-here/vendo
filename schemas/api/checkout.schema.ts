import { z } from 'zod';

/**
 * Checkout item schema
 */
export const checkoutItemSchema = z.object({
  id: z.coerce.number(),
  quantity: z.coerce.number().int().min(1, 'Quantity must be at least 1').max(20, 'Quantity must be at most 20'),
  price: z.coerce.number().nonnegative('Price must be non-negative'),
  // variantId can be string or number
  variantId: z.union([z.string(), z.number()]).optional(),
  variantValue: z.string().max(100, 'Variant value must be at most 100 characters').optional(),
});

/**
 * Checkout schema
 */
export const checkoutSchema = z.object({
  items: z.array(checkoutItemSchema).min(1, 'At least one item is required').max(20, 'At most 20 items are allowed'),
});

// checkout item type
export type CheckoutItem = z.infer<typeof checkoutItemSchema>;
