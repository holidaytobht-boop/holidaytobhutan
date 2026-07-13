import { NextResponse } from 'next/server'
import { getSession } from '@/lib/server-auth.js'

export async function GET(req) {
  const session = await getSession(req)
  if (!session) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }

  return NextResponse.json({ success: true, data: session }, { status: 200 })
}
