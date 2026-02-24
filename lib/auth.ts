import { getPayload } from 'payload';
import config from '@/payload.config';
import { cookies } from 'next/headers';

export async function getAuth() {
  const payload = await getPayload({ config });
  const cookieStore = await cookies();
  const token = cookieStore.get('payload-token')?.value;

  if (!token) {
    return null;
  }

  // validate the token by creating a fake request
  const { user } = await payload.auth({
    headers: new Headers({ cookie: `payload-token=${token}` }),
  });

  return user ?? null;
}
