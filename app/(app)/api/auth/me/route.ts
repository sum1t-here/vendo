// app/api/auth/me/route.ts
import { getAuth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET() {
  const user = await getAuth();
  return NextResponse.json({ user });
}
