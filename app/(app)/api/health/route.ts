// app/api/health/route.ts
import { getPayload } from 'payload'
import config from '@payload-config'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const payload = await getPayload({ config })
    // ping the database
    await payload.find({ collection: 'users', limit: 1 })
    return NextResponse.json({ status: 'ok', timestamp: new Date().toISOString() })
  } catch (err) {
    return NextResponse.json({ status: 'error' }, { status: 503 })
  }
}