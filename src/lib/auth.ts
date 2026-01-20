import { timingSafeEqual } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'

const adminApiKey = process.env.ADMIN_API_KEY

function getApiKey(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.slice('Bearer '.length).trim()
  }

  const apiKeyHeader = request.headers.get('x-api-key')
  return apiKeyHeader?.trim() || null
}

function safeCompare(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left)
  const rightBuffer = Buffer.from(right)

  if (leftBuffer.length !== rightBuffer.length) {
    return false
  }

  return timingSafeEqual(leftBuffer, rightBuffer)
}

export function requireAdminAuth(request: NextRequest): NextResponse | null {
  if (!adminApiKey) {
    if (process.env.NODE_ENV !== 'production') {
      return null
    }

    return NextResponse.json(
      { error: 'Admin API key not configured' },
      { status: 500 }
    )
  }

  const providedKey = getApiKey(request)
  if (!providedKey || !safeCompare(providedKey, adminApiKey)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return null
}
