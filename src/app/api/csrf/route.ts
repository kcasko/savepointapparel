import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const CSRF_TOKEN_NAME = 'csrf-token'
const TOKEN_LENGTH = 32

function generateToken(): string {
  const array = new Uint8Array(TOKEN_LENGTH)
  crypto.getRandomValues(array)
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}

export async function GET() {
  const cookieStore = await cookies()
  let token = cookieStore.get(CSRF_TOKEN_NAME)?.value

  // Generate new token if none exists
  if (!token) {
    token = generateToken()
  }

  const response = NextResponse.json({ token })

  // Set the cookie
  response.cookies.set(CSRF_TOKEN_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24, // 24 hours
  })

  return response
}
