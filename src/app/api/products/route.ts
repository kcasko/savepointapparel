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

export async function GET(request: NextRequest) {
  // Rate limiting: 120 requests per minute per IP
  const clientIp = getClientIp(request)
  const rateLimitResult = checkRateLimit(`products:${clientIp}`, {
    windowMs: 60 * 1000,
    maxRequests: 120,
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

  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '12')

  try {
    // Get synced products from your Printful store
    const syncProducts = await printful.getProducts()
    console.log(`Found ${syncProducts.length} synced products from your Printful store`)
    
    // Transform ALL sync products to our internal format first
    const allTransformedProducts = syncProducts.map(product => {
      try {
        return transformPrintfulProduct(product)
      } catch (error) {
        console.error(`Error transforming product ${product.id}:`, error)
        return null
      }
    }).filter((p): p is NonNullable<typeof p> => p !== null) // Type-safe filter

    console.log(`Successfully transformed ${allTransformedProducts.length} out of ${syncProducts.length} products`)
    
    // Apply pagination after transformation
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedProducts = allTransformedProducts.slice(startIndex, endIndex)

    return NextResponse.json({
      products: paginatedProducts,
      pagination: {
        current_page: page,
        total: allTransformedProducts.length,
        per_page: limit,
        total_pages: Math.ceil(allTransformedProducts.length / limit),
      }
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    
    // Return mock data if Printful API fails (for development)
    const mockProducts = [
      {
        id: 1,
        name: 'Cozy Gamer Vibes Kids Tee',
        price: 17.00,
        image: 'https://via.placeholder.com/400x400/1a1a1a/00ffff?text=Gamer+Tee',
        description: 'Perfect for young gamers who love retro vibes',
        category: 'Kids',
        variants: [{ id: 1, title: 'Default', price: 17.00, available: true, sku: 'GT-001' }],
        images: ['https://via.placeholder.com/400x400/1a1a1a/00ffff?text=Gamer+Tee'],
        tags: ['gaming', 'kids', 'retro'],
      },
      {
        id: 2,
        name: 'Bubble-free Stickers',
        price: 2.50,
        image: 'https://via.placeholder.com/400x400/1a1a1a/ff00ff?text=Stickers',
        description: 'High-quality gaming stickers for your setup',
        category: 'Accessories',
        variants: [{ id: 2, title: 'Default', price: 2.50, available: true, sku: 'ST-001' }],
        images: ['https://via.placeholder.com/400x400/1a1a1a/ff00ff?text=Stickers'],
        tags: ['gaming', 'stickers', 'accessories'],
      },
      {
        id: 3,
        name: 'Retro Gaming Hoodie',
        price: 45.00,
        image: 'https://via.placeholder.com/400x400/1a1a1a/00ff00?text=Hoodie',
        description: 'Stay cozy while gaming with this retro hoodie',
        category: 'Hoodies',
        variants: [
          { id: 3, title: 'Small', price: 45.00, available: true, sku: 'HD-001-S' },
          { id: 4, title: 'Medium', price: 45.00, available: true, sku: 'HD-001-M' },
          { id: 5, title: 'Large', price: 45.00, available: true, sku: 'HD-001-L' },
        ],
        images: ['https://via.placeholder.com/400x400/1a1a1a/00ff00?text=Hoodie'],
        tags: ['gaming', 'hoodie', 'apparel'],
      },
      {
        id: 4,
        name: 'Pixel Art Fanny Pack',
        price: 25.00,
        image: 'https://via.placeholder.com/400x400/1a1a1a/ffff00?text=Fanny+Pack',
        description: 'Carry your essentials in retro style',
        category: 'Accessories',
        variants: [{ id: 6, title: 'Default', price: 25.00, available: true, sku: 'FP-001' }],
        images: ['https://via.placeholder.com/400x400/1a1a1a/ffff00?text=Fanny+Pack'],
        tags: ['gaming', 'accessories', 'bag'],
      },
    ]

    return NextResponse.json({
      products: mockProducts,
      pagination: {
        current_page: 1,
        total: 4,
        per_page: limit,
        total_pages: 1,
      }
    })
  }
}