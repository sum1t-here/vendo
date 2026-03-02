import { metrics } from '@/lib/metric'
import { register } from 'prom-client'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization')
  const token = process.env.METRICS_TOKEN

  if (token && authHeader !== `Bearer ${token}`) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const data = await metrics()

  return new NextResponse(data, {
    headers: {
      'Content-Type': register.contentType,
    },
  })
}