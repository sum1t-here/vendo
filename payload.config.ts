import sharp from 'sharp';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { buildConfig } from 'payload';

export default buildConfig({
  collections: [],

  secret: process.env.PAYLOAD_SECRET!,

  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL!,
    },
  }),

  sharp,
});
