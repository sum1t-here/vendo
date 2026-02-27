import payloadConfig from '@/payload.config';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getPayload } from 'payload';

async function getUser() {
  const payload = await getPayload({ config: payloadConfig });
  const cookieStore = await cookies();
  const token = cookieStore.get('payload-token')?.value;
  if (!token) {
    return { payload, user: null };
  }
  const { user } = await payload.auth({
    headers: new Headers({ cookie: `payload-token=${token}` }),
  });
  return { payload, user };
}

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
  const { items } = await req.json();
  // console.log(items);
  // console.log(user.id);
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
