import { NextRequest, NextResponse } from 'next/server'
import PrintfulAPI, { transformPrintfulProduct } from '@/lib/printful'
import { checkRateLimit, getClientIp, getRateLimitHeaders } from '@/lib/rate-limit'

if (!process.env.PRINTFUL_API_TOKEN) {
  throw new Error('PRINTFUL_API_TOKEN is not set in environment variables')
}

const printful = new PrintfulAPI(
  process.env.PRINTFUL_API_TOKEN,
  process.env.PRINTFUL_STORE_ID
)

// Validate product ID format (should be numeric)
function isValidProductId(id: string): boolean {
  return /^\d+$/.test(id)
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Rate limiting: 60 requests per minute per IP
  const clientIp = getClientIp(request)
  const rateLimitResult = checkRateLimit(`product:${clientIp}`, {
    windowMs: 60 * 1000,
    maxRequests: 60,
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

  const id = params.id

  // Validate ID format to prevent potential injection
  if (!isValidProductId(id)) {
    return NextResponse.json(
      { error: 'Invalid product ID format' },
      { status: 400 }
    )
  }

  try {
    // Get product from Printful
    const printfulProduct = await printful.getProduct(id)
    const product = transformPrintfulProduct(printfulProduct)

    return NextResponse.json({ product })
  } catch (error) {
    console.error('Error fetching product:', error)
    
    // Return mock data if Printful API fails (for development)
    const mockProduct = {
      id: parseInt(id),
      name: 'Sample Product',
      price: 25.00,
      image: `https://via.placeholder.com/400x400/1a1a1a/00ffff?text=Product+${id}`,
      description: 'A sample retro gaming product',
      category: 'General',
      variants: [
        { id: 1, title: 'Small', price: 25.00, available: true, sku: `SP-${id}-S` },
        { id: 2, title: 'Medium', price: 25.00, available: true, sku: `SP-${id}-M` },
        { id: 3, title: 'Large', price: 25.00, available: true, sku: `SP-${id}-L` },
      ],
      images: [
        `https://via.placeholder.com/400x400/1a1a1a/00ffff?text=Product+${id}`,
        `https://via.placeholder.com/400x400/1a1a1a/ff00ff?text=Alt+View`,
      ],
      tags: ['gaming', 'retro'],
    }

    return NextResponse.json({ product: mockProduct })
  }
}