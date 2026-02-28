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
import { Cart } from './collections/Cart';
import { cloudStoragePlugin } from '@payloadcms/plugin-cloud-storage';
import { cloudinaryAdapter, cloudinary } from './lib/cloudinary';
import { stripePlugin } from '@payloadcms/plugin-stripe';
import OrderConfirmation from './components/email/order-confirmation';
import { render } from '@react-email/components';
import { Product } from './payload-types';

type Variants = NonNullable<Product['variants']>[number];

export default buildConfig({
  // admin panel
  admin: {
    user: Users.slug,
  },

  // collections
  collections: [Users, Products, Categories, Media, Orders, Cart],

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

  plugins: [
    cloudStoragePlugin({
      collections: {
        media: {
          adapter: cloudinaryAdapter,
          disableLocalStorage: true,
          generateFileURL: ({ filename }) => cloudinary.url(`vendo/${filename}`, { secure: true }),
        },
      },
    }),
    stripePlugin({
      stripeSecretKey: process.env.STRIPE_SECRET_KEY!,
      stripeWebhooksEndpointSecret: process.env.STRIPE_WEBHOOKS_ENDPOINT_SECRET!,
      webhooks: {
        'checkout.session.completed': async ({ payload, event }) => {
          const session = event.data.object;

          // prevent duplicate orders
          const { docs: existingUser } = await payload.find({
            collection: 'orders',
            where: {
              stripeSessionId: { equals: session.id },
            },
          });

          if (existingUser.length > 0) {
            return;
          }

          const items = JSON.parse(session.metadata.items);
          const userId = session.metadata.userId;

          // deduct stock
          for (const item of items) {
            const { docs } = await payload.find({
              collection: 'products',
              where: {
                id: { equals: item.id },
              },
              depth: 0,
              limit: 1,
            });

            const product = docs[0];

            if (!product) {
              console.error('Product not found for id:', item.id);
              continue;
            }

            if (item.variantId) {
              const updatedVariants = product?.variants?.map(
                (v: Variants) => (v.id === item.variantId ? { ...v, stock: Math.max(0, (v.stock ?? 0) - item.quantity) } : v)
              );

              await payload.update({
                collection: 'products',
                id: product.id,
                data: {
                  variants: updatedVariants,
                },
              });
            }
          }

          if (!userId) {
            console.error('No userId in session metadata');
            return;
          }

          const user = await payload.findByID({
            collection: 'users',
            id: Number(userId),
          });

          const street = user.address?.street;
          const city = user.address?.city;
          const state = user.address?.state;
          const zip = user.address?.zip;

          // create order
          const order = await payload.create({
            collection: 'orders',
            data: {
              customer: Number(userId),
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              items: items.map((item: any) => ({
                product: item.id,
                productName: item.name,
                price: item.price,
                quantity: item.quantity,
                variantId: item.variantId ?? null,
                variantValue: item.variantValue ?? null,
              })),
              total: (session.amount_total ?? 0) / 100,
              status: 'paid',
              stripeSessionId: session.id,
              shippingAddress: {
                address1: street,
                city,
                state,
                zip,
              },
            },
          });

          // send mail

            if (user?.email) {
              try {
                const emailHtml = await render(
                OrderConfirmation({
                  customerName: user.name,
                  orderId: order?.id,
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  items: items.map((item: any) => ({
                    productName: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    variantValue: item.variantValue ?? null,
                  })),
                  total: (session.amount_total ?? 0) / 100,
                  shippingAddress: session.shipping_details ?? undefined,
                })
              );
              await payload.sendEmail({
                to:  process.env.CONTACT_RECEIVER_EMAIL!,
                subject: `Order Confirmation - #${order.id}`,
                html: emailHtml,
              });
              } catch (error) {
                console.error('Failed to send email:', error);
              }
            }
        },
      },
    }),
  ],
});
