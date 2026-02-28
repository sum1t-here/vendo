import { stripe } from '@/lib/stripe';
import payloadConfig from '@/payload.config';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import { Product } from '@/payload-types';

type Variants = NonNullable<Product['variants']>[number];

export async function POST(req: Request) {
  try {
    const { items } = await req.json();

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

      // validate price and variant price
      let availableStock: number = 0;
      let unitPrice = product.price;

      if (cartItem.variantId) {
        // check if variant exists
        const variant = product.variants?.find((v: Variants) => v.id === cartItem.variantId);
        if (!variant) {
          return NextResponse.json({ error: 'Variant not found' }, { status: 404 });
        }
        // update the stock and price to variant stock and price
        availableStock = variant.stock ?? 0;
        unitPrice = variant.price ?? product.price;
      }

      // check if the stock is enough
      if (cartItem.quantity > availableStock) {
        return NextResponse.json({ error: 'Product stock is not enough' }, { status: 400 });
      }

      // check if the price is same as the price in the database
      if (cartItem.price !== unitPrice) {
        return NextResponse.json({ error: 'Product price has changed' }, { status: 400 });
      }

      // add the item to the validated items
      validatedItems.push({
        id: product.id,
        name: product.name,
        quantity: cartItem.quantity,
        price: unitPrice, // price from the DB
        variantId: cartItem.variantId,
        variantValue: cartItem.variantValue,
        stock: availableStock, // stock from the DB
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
      success_url: `${process.env.NEXT_PUBLIC_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/cart`,
    });

    return NextResponse.json({ session });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
