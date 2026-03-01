import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    env: {
      PAYLOAD_SECRET: 'test-secret',
      DATABASE_URL: 'postgresql://postgres:vendo@localhost:5432/vendo-test',
      RESEND_API_KEY: 'test-key',
      RESEND_FROM_ADDRESS: 'test@test.com',
      CONTACT_RECEIVER_EMAIL: 'test@test.com',
      CLOUDINARY_CLOUD_NAME: 'test',
      CLOUDINARY_API_KEY: 'test',
      CLOUDINARY_API_SECRET: 'test',
      STRIPE_SECRET_KEY: 'test-key',
      STRIPE_WEBHOOKS_ENDPOINT_SECRET: 'test-secret',
      NEXT_PUBLIC_URL: 'http://localhost:3000',
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
});
