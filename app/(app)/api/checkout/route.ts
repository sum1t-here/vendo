import { stripe } from '@/lib/stripe';
import payloadConfig from '@/payload.config';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import { Product } from '@/payload-types';
import { env } from '@/schemas/env.schema';
import { checkoutSchema } from '@/schemas/api/checkout.schema';
import z from 'zod';

type Variants = NonNullable<Product['variants']>[number];

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const parsed = checkoutSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: z.prettifyError(parsed.error) }, { status: 400 });
    }

    const { items } = parsed.data;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'No items in cart' }, { status: 400 });
    }

    const payload = await getPayload({ config: payloadConfig });

    const cookieStore = await cookies();
    const token = cookieStore.get('payload-token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'No token found' }, { status: 401 });
    }

    const user = await payload.auth({
      headers: new Headers({
        cookie: `payload-token=${token}`,
      }),
    });

    if (!user) {
      return NextResponse.json({ error: 'No user found' }, { status: 401 });
    }

    const validatedItems = [];

    for (const cartItem of items) {
      const { docs } = await payload.find({
        collection: 'products',
        where: {
          and: [{ id: { equals: cartItem.id } }, { status: { equals: 'published' } }],
        },
        depth: 0,
        limit: 1,
      });

      const product = docs[0];

      if (!product) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }

      const hasVariants = product.variants && product.variants.length > 0;

      if (!hasVariants) {
        return NextResponse.json({ error: 'Product has no variants' }, { status: 400 });
      }

      if (!cartItem.variantId) {
        return NextResponse.json({ error: 'Variant id is required' }, { status: 400 });
      }

      const variant = product.variants?.find((v: Variants) => v.id === cartItem.variantId);

      if (!variant) {
        return NextResponse.json({ error: 'Variant not found' }, { status: 404 });
      }

      // validate price and variant price
      const availableStock: number = variant.stock ?? 0;
      const unitPrice = variant.price ?? product.price;

      if (cartItem.quantity > availableStock) {
        return NextResponse.json({ error: 'Product stock is not enough' }, { status: 400 });
      }

      if (cartItem.price !== unitPrice) {
        return NextResponse.json({ error: 'Product price has changed' }, { status: 400 });
      }

      validatedItems.push({
        id: product.id,
        name: product.name,
        quantity: cartItem.quantity,
        price: unitPrice,
        variantId: cartItem.variantId,
        variantValue: cartItem.variantValue,
        stock: availableStock,
      });
    }

    // create stripe session with validated db data
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      metadata: {
        userId: user.user?.id?.toString() ?? '',
        items: JSON.stringify(
          validatedItems.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            variantId: item.variantId,
            variantValue: item.variantValue,
          }))
        ),
      },
      line_items: validatedItems.map(item => ({
        price_data: {
          currency: 'inr',
          product_data: {
            name: item.name,
            ...(item.variantValue && {
              description: `Variant: ${item.variantValue}`,
            }),
          },
          unit_amount: item.price * 100, // paise
        },
        quantity: item.quantity,
      })),
      success_url: `${env.NEXT_PUBLIC_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${env.NEXT_PUBLIC_URL}/cart`,
    });

    return NextResponse.json({ session });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
