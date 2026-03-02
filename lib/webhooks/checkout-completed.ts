import type { StripeWebhookHandler } from '@payloadcms/plugin-stripe/types';
import { render } from '@react-email/components';
import OrderConfirmation from '@/components/email/order-confirmation';
import type { Product } from '@/payload-types';
import { checkoutMetadataSchema } from '@/schemas/stripe-webhook';

type Variants = NonNullable<Product['variants']>[number];

export const checkoutSessionCompleted: StripeWebhookHandler = async ({ payload, event }) => {
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

  if (!session.metadata?.items || !session.metadata?.userId) {
    console.error('Missing metadata');
    return;
  }

  let parsedMetadata;

  try {
    parsedMetadata = checkoutMetadataSchema.parse(session.metadata);
  } catch (error) {
    console.error('Invalid metadata', error);
    return;
  }

  const { items, userId } = parsedMetadata;

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
      return;
    }

    if (item.variantId) {
      const updatedVariants = product?.variants?.map((v: Variants) =>
        v.id === item.variantId ? { ...v, stock: Math.max(0, (v.stock ?? 0) - item.quantity) } : v
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
      items: items.map(item => ({
        product: item.id,
        productName: item.name,
        price: item.price,
        quantity: item.quantity,
        variantId: item.variantId ? String(item.variantId) : null,
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
        to: user.email,
        subject: `Order Confirmation - #${order.id}`,
        html: emailHtml,
      });
    } catch {
      console.error('Failed to send email');
    }
  }
};
