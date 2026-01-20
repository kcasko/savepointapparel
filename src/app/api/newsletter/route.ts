import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { requireAdminAuth } from '@/lib/auth'
import { validateCSRFToken, csrfErrorResponse } from '@/lib/csrf'
import { checkRateLimit, getClientIp, getRateLimitHeaders } from '@/lib/rate-limit'

// Stricter email validation regex with length limits
// Max local part: 64 chars, max domain: 255 chars, min TLD: 2 chars
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]{1,64}@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,253}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,253}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/
const MAX_EMAIL_LENGTH = 254 // RFC 5321

const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const MAX_REQUESTS = 5 // 5 requests per minute

export async function POST(request: NextRequest) {
  // CSRF validation for newsletter signup (state-changing operation)
  const isValidCSRF = await validateCSRFToken(request)
  if (!isValidCSRF) {
    return csrfErrorResponse()
  }

  try {
    // Validate Content-Type header
    const contentType = request.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      return NextResponse.json(
        { error: 'Content-Type must be application/json' },
        { status: 400 }
      )
    }

    // Get client IP for rate limiting
    const ip = getClientIp(request)
    const rateLimitResult = checkRateLimit(`newsletter:${ip}`, {
      windowMs: RATE_LIMIT_WINDOW,
      maxRequests: MAX_REQUESTS,
    })

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        {
          status: 429,
          headers: getRateLimitHeaders(rateLimitResult),
        }
      )
    }

    const body = await request.json()
    const { email } = body

    // Validate email is provided
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Validate email length
    const trimmedEmail = email.trim().toLowerCase()
    if (trimmedEmail.length > MAX_EMAIL_LENGTH) {
      return NextResponse.json(
        { error: 'Email address is too long' },
        { status: 400 }
      )
    }

    // Validate email format
    if (!EMAIL_REGEX.test(trimmedEmail)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      )
    }

    const existingSubscriber = await prisma.newsletterSubscriber.findUnique({
      where: { email: trimmedEmail },
    })

    if (existingSubscriber?.isActive) {
      return NextResponse.json(
        { message: 'You are already subscribed!', alreadySubscribed: true },
        { status: 200 }
      )
    }

    const source = typeof body.source === 'string' ? body.source.trim() : ''
    const normalizedSource = source ? source.slice(0, 100) : undefined
    const ipAddress = ip === 'unknown' ? null : ip

    if (existingSubscriber) {
      await prisma.newsletterSubscriber.update({
        where: { email: trimmedEmail },
        data: {
          isActive: true,
          unsubscribedAt: null,
          source: normalizedSource || existingSubscriber.source,
          ipAddress,
        },
      })
    } else {
      await prisma.newsletterSubscriber.create({
        data: {
          email: trimmedEmail,
          source: normalizedSource || undefined,
          ipAddress,
        },
      })
    }

    return NextResponse.json({
      message: 'Successfully subscribed to the newsletter!',
      success: true
    })
  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return NextResponse.json(
      { error: 'Failed to subscribe. Please try again.' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const authError = requireAdminAuth(request)
  if (authError) {
    return authError
  }

  const count = await prisma.newsletterSubscriber.count({
    where: { isActive: true },
  })

  return NextResponse.json({
    count,
    message: 'Newsletter API is running',
  })
}
