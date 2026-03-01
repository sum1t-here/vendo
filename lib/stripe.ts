import Stripe from 'stripe';
import { env } from '@/schemas/env.schema';

export const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-08-01',
});
