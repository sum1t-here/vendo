import Stripe from 'stripe';
import { env } from '@/schemas/env.schema';

export const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  // @ts-expect-error acacia is a valid api version
  apiVersion: '2025-02-04.acacia',
});
 