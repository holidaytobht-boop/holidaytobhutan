import { mkdir, writeFile } from 'fs/promises'
import path from 'path'
import { randomUUID } from 'crypto'
import { NextResponse } from 'next/server'
import { ensureDb } from '@/lib/db/ensure.js'
import { getSession } from '@/lib/server-auth.js'
import { enforceRateLimit } from '@/lib/security/guard.js'
import { isAllowedOrigin } from '@/lib/security/origin.js'
import { detectImageType, extensionForImageType } from '@/lib/security/imageValidation.js'

const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
const MAX_BYTES = 5 * 1024 * 1024

export async function POST(req) {
  const limited = enforceRateLimit(req, 'uploads', { limit: 20, windowMs: 60 * 60 * 1000 })
  if (limited) return limited

  if (!isAllowedOrigin(req)) {
    return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })
  }

  const session = await getSession(req)
  if (!session) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }

  await ensureDb()

  const formData = await req.formData()
  const file = formData.get('image')

  if (!file || typeof file === 'string') {
    return NextResponse.json({ success: false, message: 'No image file provided.' }, { status: 400 })
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json({ success: false, message: 'File too large (max 5MB).' }, { status: 400 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const detectedType = detectImageType(buffer)
  const ext = extensionForImageType(detectedType)

  if (!ext) {
    return NextResponse.json(
      { success: false, message: 'Only valid JPEG and PNG images are allowed.' },
      { status: 400 }
    )
  }

  const declaredExt = path.extname(file.name || '').toLowerCase()
  if (declaredExt && !['.jpg', '.jpeg', '.png'].includes(declaredExt)) {
    return NextResponse.json(
      { success: false, message: 'Only JPEG and PNG images are allowed.' },
      { status: 400 }
    )
  }

  await mkdir(uploadsDir, { recursive: true })
  const filename = `${randomUUID()}${ext}`
  await writeFile(path.join(uploadsDir, filename), buffer)

  return NextResponse.json(
    { success: true, data: { url: `/uploads/${filename}`, filename } },
    { status: 201 }
  )
}
