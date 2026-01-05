import { NextRequest, NextResponse } from 'next/server'
import PrintfulAPI, { transformPrintfulProduct } from '@/lib/printful'

if (!process.env.PRINTFUL_API_TOKEN) {
  throw new Error('PRINTFUL_API_TOKEN is not set in environment variables')
}

const printful = new PrintfulAPI(
  process.env.PRINTFUL_API_TOKEN,
  process.env.PRINTFUL_STORE_ID
)

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '12')

  try {
    // Get synced products from your Printful store
    const syncProducts = await printful.getProducts()
    console.log(`Found ${syncProducts.length} synced products from your Printful store`)
    
    // Transform sync products to our internal format
    const transformedProducts = syncProducts.slice(0, limit).map(product => {
      try {
        return transformPrintfulProduct(product)
      } catch (error) {
        console.error(`Error transforming product ${product.id}:`, error)
        return null
      }
    }).filter(Boolean)

    console.log(`Transformed ${transformedProducts.length} products successfully`)

    return NextResponse.json({
      products: transformedProducts,
      pagination: {
        current_page: page,
        total: syncProducts.length,
        per_page: limit,
        total_pages: Math.ceil(syncProducts.length / limit),
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