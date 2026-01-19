import { NextRequest, NextResponse } from 'next/server'

// Simple in-memory store for demo - in production, use a database or email service
const subscribers = new Set<string>()

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Rate limiting: track requests per IP
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const MAX_REQUESTS = 5 // 5 requests per minute

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const record = rateLimitMap.get(ip)

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return false
  }

  if (record.count >= MAX_REQUESTS) {
    return true
  }

  record.count++
  return false
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
               request.headers.get('x-real-ip') ||
               'unknown'

    // Check rate limit
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
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

    // Validate email format
    const trimmedEmail = email.trim().toLowerCase()
    if (!EMAIL_REGEX.test(trimmedEmail)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      )
    }

    // Check if already subscribed
    if (subscribers.has(trimmedEmail)) {
      return NextResponse.json(
        { message: 'You are already subscribed!', alreadySubscribed: true },
        { status: 200 }
      )
    }

    // Add to subscribers
    subscribers.add(trimmedEmail)

    // In production, you would:
    // 1. Save to database
    // 2. Send confirmation email
    // 3. Integrate with email service (Mailchimp, SendGrid, etc.)

    console.log(`New newsletter subscriber: ${trimmedEmail}`)

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

export async function GET() {
  // Return subscriber count (for admin purposes)
  return NextResponse.json({
    count: subscribers.size,
    message: 'Newsletter API is running'
  })
}
