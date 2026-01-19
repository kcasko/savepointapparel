interface RateLimitRecord {
  count: number
  resetTime: number
}

// In-memory store for rate limiting
// In production, use Redis or a similar distributed store
const rateLimitStore = new Map<string, RateLimitRecord>()

interface RateLimitOptions {
  windowMs?: number    // Time window in milliseconds
  maxRequests?: number // Maximum requests per window
}

const DEFAULT_WINDOW_MS = 60 * 1000  // 1 minute
const DEFAULT_MAX_REQUESTS = 60       // 60 requests per minute

export interface RateLimitResult {
  success: boolean
  remaining: number
  resetTime: number
}

/**
 * Check if a request should be rate limited
 * @param identifier - Unique identifier for the client (IP address, user ID, etc.)
 * @param options - Rate limiting options
 * @returns Rate limit result with remaining requests and reset time
 */
export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions = {}
): RateLimitResult {
  const windowMs = options.windowMs ?? DEFAULT_WINDOW_MS
  const maxRequests = options.maxRequests ?? DEFAULT_MAX_REQUESTS
  const now = Date.now()

  const record = rateLimitStore.get(identifier)

  // If no record exists or window has expired, create a new one
  if (!record || now > record.resetTime) {
    const resetTime = now + windowMs
    rateLimitStore.set(identifier, { count: 1, resetTime })
    return {
      success: true,
      remaining: maxRequests - 1,
      resetTime,
    }
  }

  // Check if limit exceeded
  if (record.count >= maxRequests) {
    return {
      success: false,
      remaining: 0,
      resetTime: record.resetTime,
    }
  }

  // Increment counter
  record.count++
  return {
    success: true,
    remaining: maxRequests - record.count,
    resetTime: record.resetTime,
  }
}

/**
 * Get client IP from request headers
 */
export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim()
  }

  const realIp = request.headers.get('x-real-ip')
  if (realIp) {
    return realIp
  }

  return 'unknown'
}

/**
 * Create rate limit headers for response
 */
export function getRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': new Date(result.resetTime).toISOString(),
  }
}

// Clean up expired entries periodically (every 5 minutes)
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    const entries = Array.from(rateLimitStore.entries())
    for (const [key, record] of entries) {
      if (now > record.resetTime) {
        rateLimitStore.delete(key)
      }
    }
  }, 5 * 60 * 1000)
}
