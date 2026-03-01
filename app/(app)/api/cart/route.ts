import { getUser } from '@/lib/getUser';
import { cartSchema } from '@/schemas/api/cart.schema';
import { NextResponse } from 'next/server';
import z from 'zod';

export async function GET() {
  const { payload, user } = await getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { docs } = await payload.find({
    collection: 'cart',
    where: {
      customer: { equals: user.id },
    },
    limit: 1,
  });

  return NextResponse.json({ items: docs[0]?.items ?? [] });
}

export async function POST(req: Request) {
  const { payload, user } = await getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = await req.json();

  const parsed = cartSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: z.prettifyError(parsed.error) }, { status: 400 });
  }

  const { items } = parsed.data;

  const { docs } = await payload.find({
    collection: 'cart',
    where: {
      customer: { equals: user.id },
    },
    limit: 1,
  });
  if (docs.length > 0) {
    await payload.update({
      collection: 'cart',
      id: docs[0].id,
      data: { items },
    });
  } else {
    await payload.create({
      collection: 'cart',
      data: { customer: user.id, items },
    });
  }
  return NextResponse.json({ success: true });
}

export async function DELETE() {
  const { payload, user } = await getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { docs } = await payload.find({
    collection: 'cart',
    where: {
      customer: { equals: user.id },
    },
    limit: 1,
  });
  if (docs.length > 0) {
    await payload.delete({
      collection: 'cart',
      id: docs[0].id,
    });
  }
  return NextResponse.json({ success: true });
}
