import { NextRequest, NextResponse } from 'next/server'
import { createCheckoutSession, CheckoutSessionData } from '@/lib/stripe'
import PrintfulAPI, { transformPrintfulProduct } from '@/lib/printful'
import { checkRateLimit, getClientIp, getRateLimitHeaders } from '@/lib/rate-limit'

interface CheckoutItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
  sync_variant_id?: number
}

// Validate and get server-side prices for items
async function validateAndGetPrices(items: CheckoutItem[]): Promise<{ validatedItems: CheckoutItem[]; errors: string[] }> {
  const errors: string[] = []
  const validatedItems: CheckoutItem[] = []

  // If no Printful token, skip validation (development mode)
  if (!process.env.PRINTFUL_API_TOKEN) {
    console.warn('PRINTFUL_API_TOKEN not set, skipping price validation')
    return { validatedItems: items, errors: [] }
  }

  const printful = new PrintfulAPI(
    process.env.PRINTFUL_API_TOKEN,
    process.env.PRINTFUL_STORE_ID
  )

  try {
    // Fetch all products to validate prices
    const syncProducts = await printful.getProducts()
    const transformedProducts = syncProducts
      .map(transformPrintfulProduct)
      .filter((p): p is NonNullable<typeof p> => p !== null)

    // Build a map of sync_variant_id -> price for quick lookup
    const priceMap = new Map<number, { price: number; name: string }>()
    for (const product of transformedProducts) {
      if (product.variants) {
        for (const variant of product.variants) {
          if (variant.sync_variant_id) {
            priceMap.set(variant.sync_variant_id, {
              price: variant.price,
              name: `${product.name} - ${variant.title}`,
            })
          }
        }
      }
      // Also map by product ID for items without variant
      priceMap.set(product.id, { price: product.price, name: product.name })
    }

    for (const item of items) {
      // Validate quantity
      if (!Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 99) {
        errors.push(`Invalid quantity for ${item.name}: must be between 1 and 99`)
        continue
      }

      // Look up server-side price
      let serverPrice: number | null = null
      let serverName: string | null = null

      if (item.sync_variant_id) {
        const variantData = priceMap.get(item.sync_variant_id)
        if (variantData) {
          serverPrice = variantData.price
          serverName = variantData.name
        }
      }

      // Fallback to product ID lookup
      if (serverPrice === null) {
        const productId = parseInt(item.id)
        if (!isNaN(productId)) {
          const productData = priceMap.get(productId)
          if (productData) {
            serverPrice = productData.price
            serverName = productData.name
          }
        }
      }

      if (serverPrice === null) {
        // Product not found - could be mock data in development
        console.warn(`Product not found for validation: ${item.id} (${item.name})`)
        // Allow it through but log warning
        validatedItems.push(item)
        continue
      }

      // Check if client price matches server price (allow small floating point difference)
      const priceDiff = Math.abs(item.price - serverPrice)
      if (priceDiff > 0.01) {
        console.warn(`Price mismatch for ${item.name}: client=${item.price}, server=${serverPrice}`)
        // Use server price instead of rejecting
        validatedItems.push({
          ...item,
          price: serverPrice,
          name: serverName || item.name,
        })
      } else {
        validatedItems.push(item)
      }
    }
  } catch (error) {
    console.error('Error validating prices:', error)
    // On validation error, still allow checkout but log warning
    // This prevents checkout from breaking if Printful API is down
    return { validatedItems: items, errors: [] }
  }

  return { validatedItems, errors }
}

export async function POST(request: NextRequest) {
  // Rate limiting: 10 checkout attempts per minute per IP
  const clientIp = getClientIp(request)
  const rateLimitResult = checkRateLimit(`checkout:${clientIp}`, {
    windowMs: 60 * 1000,
    maxRequests: 10,
  })

  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: 'Too many checkout attempts. Please try again later.' },
      {
        status: 429,
        headers: getRateLimitHeaders(rateLimitResult),
      }
    )
  }

  try {
    const body = await request.json()
    const { items, customerInfo } = body

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'No items provided for checkout' },
        { status: 400 }
      )
    }

    // Validate items have required fields
    for (const item of items) {
      if (!item.id || !item.name || typeof item.price !== 'number' || typeof item.quantity !== 'number') {
        return NextResponse.json(
          { error: 'Invalid item data: missing required fields' },
          { status: 400 }
        )
      }
      if (item.price < 0) {
        return NextResponse.json(
          { error: 'Invalid item data: price cannot be negative' },
          { status: 400 }
        )
      }
    }

    // Validate and get server-side prices
    const { validatedItems, errors } = await validateAndGetPrices(items)

    if (errors.length > 0) {
      return NextResponse.json(
        { error: errors.join('; ') },
        { status: 400 }
      )
    }

    if (validatedItems.length === 0) {
      return NextResponse.json(
        { error: 'No valid items for checkout' },
        { status: 400 }
      )
    }

    // Get the base URL for redirect URLs
    const origin = request.headers.get('origin') || 'http://localhost:3000'

    const checkoutData: CheckoutSessionData = {
      items: validatedItems.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        sync_variant_id: item.sync_variant_id,
      })),
      customerInfo,
      successUrl: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${origin}/checkout/cancel`,
      metadata: {
        source: 'website',
        item_count: validatedItems.length.toString(),
      },
    }

    const session = await createCheckoutSession(checkoutData)

    return NextResponse.json({
      clientSecret: session.client_secret
    })
  } catch (error) {
    console.error('Checkout session creation failed:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}