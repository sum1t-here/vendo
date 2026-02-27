import payloadConfig from '@/payload.config';
import { cookies } from 'next/headers';
import { getPayload } from 'payload';

export async function getUser() {
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
