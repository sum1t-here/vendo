import { z } from 'zod';

export const webhookItemSchema = z.object({
  id: z.coerce.number(),
  name: z.string(),
  price: z.coerce.number().nonnegative(),
  quantity: z.coerce.number().int().min(1),
  variantId: z.union([z.string(), z.number()]).optional(),
  variantValue: z.string().optional(),
});

export const checkoutMetadataSchema = z.object({
  userId: z.string().min(1),
  items: z.array(webhookItemSchema).min(1),
});

export type WebhookItem = z.infer<typeof webhookItemSchema>;
export type CheckoutMetadata = z.infer<typeof checkoutMetadataSchema>;
