import { NextRequest, NextResponse } from 'next/server'
import { createCheckoutSession, CheckoutSessionData } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { items, customerInfo } = body

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'No items provided for checkout' },
        { status: 400 }
      )
    }

    // Get the base URL for redirect URLs
    const origin = request.headers.get('origin') || 'http://localhost:3000'

    const checkoutData: CheckoutSessionData = {
      items: items.map((item: any) => ({
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
        item_count: items.length.toString(),
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