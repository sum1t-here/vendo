import { z } from 'zod';

export const envSchema = z.object({
  // payload
  PAYLOAD_SECRET: z.string().min(1),

  // database
  DATABASE_URL: z.string().min(1),

  // cloudinary
  CLOUDINARY_CLOUD_NAME: z.string().min(1),
  CLOUDINARY_API_KEY: z.string().min(1),
  CLOUDINARY_API_SECRET: z.string().min(1),

  // resend
  RESEND_API_KEY: z.string().min(1),
  RESEND_FROM_ADDRESS: z.string().min(1),
  CONTACT_RECEIVER_EMAIL: z.string().min(1),

  // stripe
  STRIPE_SECRET_KEY: z.string().min(1),
  STRIPE_WEBHOOKS_ENDPOINT_SECRET: z.string().min(1),

  // app
  NEXT_PUBLIC_URL: z.string().min(1),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment variable :');
  console.error(z.prettifyError(parsed.error));
  process.exit(1);
}

export const env = parsed.data;
