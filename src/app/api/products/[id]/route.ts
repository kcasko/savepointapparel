import { NextRequest, NextResponse } from 'next/server'
import PrintfulAPI, { transformPrintfulProduct } from '@/lib/printful'

if (!process.env.PRINTFUL_API_TOKEN) {
  throw new Error('PRINTFUL_API_TOKEN is not set in environment variables')
}

const printful = new PrintfulAPI(
  process.env.PRINTFUL_API_TOKEN,
  process.env.PRINTFUL_STORE_ID
)

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id

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