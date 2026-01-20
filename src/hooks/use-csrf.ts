'use client'

import { useState, useEffect, useCallback } from 'react'

const CSRF_HEADER_NAME = 'x-csrf-token'

interface UseCSRFReturn {
  token: string | null
  isLoading: boolean
  error: Error | null
  getHeaders: () => Record<string, string>
  refreshToken: () => Promise<void>
}

export function useCSRF(): UseCSRFReturn {
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchToken = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch('/api/csrf', {
        method: 'GET',
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to fetch CSRF token')
      }

      const data = await response.json()
      setToken(data.token)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'))
      console.error('Failed to fetch CSRF token:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchToken()
  }, [fetchToken])

  const getHeaders = useCallback((): Record<string, string> => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    if (token) {
      headers[CSRF_HEADER_NAME] = token
    }

    return headers
  }, [token])

  return {
    token,
    isLoading,
    error,
    getHeaders,
    refreshToken: fetchToken,
  }
}

/**
 * Helper function for making CSRF-protected fetch requests
 */
export async function csrfFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  // First, ensure we have a CSRF token
  const tokenResponse = await fetch('/api/csrf', {
    method: 'GET',
    credentials: 'include',
  })

  if (!tokenResponse.ok) {
    throw new Error('Failed to fetch CSRF token')
  }

  const { token } = await tokenResponse.json()

  // Make the actual request with CSRF header
  return fetch(url, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      [CSRF_HEADER_NAME]: token,
      ...options.headers,
    },
  })
}
