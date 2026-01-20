import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

const CSRF_TOKEN_NAME = 'csrf-token'
const CSRF_HEADER_NAME = 'x-csrf-token'
const TOKEN_LENGTH = 32

/**
 * Generate a cryptographically secure random token
 */
function generateToken(): string {
  const array = new Uint8Array(TOKEN_LENGTH)
  crypto.getRandomValues(array)
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}

/**
 * Get or create a CSRF token for the current session
 * Returns the token value
 */
export async function getCSRFToken(): Promise<string> {
  const cookieStore = await cookies()
  let token = cookieStore.get(CSRF_TOKEN_NAME)?.value

  if (!token) {
    token = generateToken()
    // Token will be set by the middleware or API route
  }

  return token
}

/**
 * Set CSRF token cookie in response
 */
export function setCSRFCookie(response: NextResponse, token: string): void {
  response.cookies.set(CSRF_TOKEN_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24, // 24 hours
  })
}

/**
 * Validate CSRF token from request
 * Returns true if valid, false otherwise
 */
export async function validateCSRFToken(request: NextRequest): Promise<boolean> {
  // Get token from cookie
  const cookieToken = request.cookies.get(CSRF_TOKEN_NAME)?.value

  // Get token from header
  const headerToken = request.headers.get(CSRF_HEADER_NAME)

  // Both must exist and match
  if (!cookieToken || !headerToken) {
    return false
  }

  // Use timing-safe comparison to prevent timing attacks
  return timingSafeEqual(cookieToken, headerToken)
}

/**
 * Timing-safe string comparison to prevent timing attacks
 */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false
  }

  let result = 0
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }

  return result === 0
}

/**
 * Create a CSRF validation error response
 */
export function csrfErrorResponse(): NextResponse {
  return NextResponse.json(
    { error: 'Invalid or missing CSRF token' },
    { status: 403 }
  )
}

/**
 * Middleware helper to validate CSRF for state-changing requests
 */
export async function withCSRFProtection(
  request: NextRequest,
  handler: () => Promise<NextResponse>
): Promise<NextResponse> {
  // Skip CSRF for GET, HEAD, OPTIONS (safe methods)
  const safeMethods = ['GET', 'HEAD', 'OPTIONS']
  if (safeMethods.includes(request.method)) {
    return handler()
  }

  // Validate CSRF token
  const isValid = await validateCSRFToken(request)
  if (!isValid) {
    console.warn(`CSRF validation failed for ${request.method} ${request.url}`)
    return csrfErrorResponse()
  }

  return handler()
}
