import sharp from 'sharp';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { buildConfig } from 'payload';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { resendAdapter } from '@payloadcms/email-resend';
import { Products } from './collections/Products';
import { Categories } from './collections/Categories';
import { Media } from './collections/Media';
import { Orders } from './collections/Orders';
import { Users } from './collections/Users';

export default buildConfig({
  // admin panel
  admin: {
    user: Users.slug,
  },

  // collections
  collections: [Users, Products, Categories, Media, Orders],

  // secret
  secret: process.env.PAYLOAD_SECRET!,

  // database
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL!,
    },
  }),

  // email
  email: resendAdapter({
    apiKey: process.env.RESEND_API_KEY!,
    defaultFromAddress: process.env.RESEND_FROM_ADDRESS!,
    defaultFromName: 'Vendo',
  }),

  // editor
  editor: lexicalEditor({}),

  // image processing
  sharp,
});
