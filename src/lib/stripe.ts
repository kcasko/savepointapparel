import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
})

export interface CheckoutSessionData {
  items: Array<{
    id: string
    name: string
    price: number
    quantity: number
    image?: string
    sync_variant_id?: number
  }>
  customerInfo?: {
    email?: string
    name?: string
  }
  shippingAddress?: Stripe.Checkout.SessionCreateParams.ShippingAddressCollection
  successUrl: string
  cancelUrl: string
  metadata?: Record<string, string>
}

export async function createCheckoutSession(data: CheckoutSessionData): Promise<Stripe.Checkout.Session> {
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = data.items.map(item => ({
    price_data: {
      currency: 'usd',
      product_data: {
        name: item.name,
        images: item.image ? [item.image] : undefined,
        metadata: {
          product_id: item.id,
          sync_variant_id: item.sync_variant_id?.toString() || '',
        },
      },
      unit_amount: Math.round(item.price * 100), // Convert to cents
    },
    quantity: item.quantity,
  }))

  const session = await stripe.checkout.sessions.create({
    ui_mode: 'embedded',
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    return_url: data.successUrl,
    shipping_address_collection: data.shippingAddress || {
      allowed_countries: ['US', 'CA', 'GB', 'AU'],
    },
    phone_number_collection: {
      enabled: true, // Required for Printful shipping
    },
    customer_email: data.customerInfo?.email,
    metadata: {
      ...data.metadata,
      order_source: 'website',
    },
    automatic_tax: {
      enabled: true,
    },
    shipping_options: [
      {
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: {
            amount: 0, // Free shipping
            currency: 'usd',
          },
          display_name: 'Free shipping',
          delivery_estimate: {
            minimum: {
              unit: 'business_day',
              value: 5,
            },
            maximum: {
              unit: 'business_day',
              value: 7,
            },
          },
        },
      },
      {
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: {
            amount: 999, // $9.99
            currency: 'usd',
          },
          display_name: 'Express shipping',
          delivery_estimate: {
            minimum: {
              unit: 'business_day',
              value: 2,
            },
            maximum: {
              unit: 'business_day',
              value: 3,
            },
          },
        },
      },
    ],
  })

  return session
}

export async function retrieveCheckoutSession(sessionId: string): Promise<Stripe.Checkout.Session> {
  return await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ['line_items', 'customer', 'payment_intent'],
  })
}

export async function constructWebhookEvent(
  body: string,
  signature: string,
  webhookSecret: string
): Promise<Stripe.Event> {
  return stripe.webhooks.constructEvent(body, signature, webhookSecret)
}

export async function handleWebhookEvent(event: Stripe.Event) {
  console.log(`🔔 Webhook received: ${event.type}`)

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      console.log(`💰 Payment successful for session: ${session.id}`)
      
      // Here you would typically:
      // 1. Create order in your database
      // 2. Send order to Printify for fulfillment
      // 3. Send confirmation email to customer
      // 4. Update inventory if needed
      
      await handleSuccessfulPayment(session)
      break
    }

    case 'checkout.session.expired': {
      const session = event.data.object as Stripe.Checkout.Session
      console.log(`⏰ Checkout session expired: ${session.id}`)
      break
    }

    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      console.log(`✅ Payment intent succeeded: ${paymentIntent.id}`)
      break
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      console.log(`❌ Payment failed: ${paymentIntent.id}`)
      break
    }

    default:
      console.log(`🤷‍♀️ Unhandled event type: ${event.type}`)
  }
}

async function handleSuccessfulPayment(session: Stripe.Checkout.Session) {
  try {
    // Get expanded session with line items
    const expandedSession = await retrieveCheckoutSession(session.id)
    
    if (!expandedSession.line_items?.data) {
      throw new Error('No line items found in session')
    }

    const shippingDetails = session.shipping_details || expandedSession.shipping_details
    const customerDetails = session.customer_details || expandedSession.customer_details

    if (!customerDetails?.email) {
      console.warn('No customer email found, waiting for session completion')
      return // Exit early, webhook will be called again when session is fully completed
    }

    // For embedded checkout, shipping details may be collected but not yet in the session
    if (!shippingDetails?.address) {
      console.warn('Shipping address not yet collected')
      return // Exit early, will process when address is available
    }

    // Extract order details
    const orderData = {
      stripeSessionId: session.id,
      customerEmail: customerDetails.email,
      customerName: customerDetails.name || shippingDetails.name || 'Customer',
      customerPhone: customerDetails.phone,
      shippingAddress: {
        name: shippingDetails.name || customerDetails.name || 'Customer',
        address1: shippingDetails.address.line1 || '',
        address2: shippingDetails.address.line2 || '',
        city: shippingDetails.address.city || '',
        state_code: shippingDetails.address.state || '',
        country_code: shippingDetails.address.country || '',
        zip: shippingDetails.address.postal_code || '',
        phone: customerDetails.phone || '',
        email: customerDetails.email,
      },
      items: expandedSession.line_items.data.map(item => ({
        name: item.description,
        productId: item.price?.product?.toString() || '',
        syncVariantId: item.price?.metadata?.sync_variant_id,
        quantity: item.quantity || 1,
        price: item.price?.unit_amount ? (item.price.unit_amount / 100).toFixed(2) : '0.00',
      })),
      totalAmount: session.amount_total ? (session.amount_total / 100).toFixed(2) : '0.00',
      currency: session.currency,
      paymentStatus: session.payment_status,
    }

    console.log('📦 Creating Printful order with data:', JSON.stringify(orderData, null, 2))

    // Create Printful order
    try {
      const PrintfulAPI = (await import('./printful')).default
      const printful = new PrintfulAPI(
        process.env.PRINTFUL_API_TOKEN!,
        process.env.PRINTFUL_STORE_ID
      )

      // Map items to Printful order format
      const printfulOrderItems = orderData.items.map(item => {
        const syncVariantId = item.syncVariantId ? parseInt(item.syncVariantId) : null
        
        if (!syncVariantId || isNaN(syncVariantId)) {
          console.warn(`Skipping item ${item.name} - missing or invalid sync_variant_id`)
          return null
        }
        
        return {
          sync_variant_id: syncVariantId,
          quantity: item.quantity,
          price: item.price,
          retail_price: item.price,
        }
      }).filter((item): item is NonNullable<typeof item> => item !== null) // Type-safe filter

      if (printfulOrderItems.length === 0) {
        console.warn('⚠️ No valid Printful items found in order')
        return orderData
      }

      const printfulOrder = {
        external_id: session.id,
        shipping: 'STANDARD',
        recipient: {
          name: orderData.shippingAddress.name,
          address1: orderData.shippingAddress.address1,
          address2: orderData.shippingAddress.address2,
          city: orderData.shippingAddress.city,
          state_code: orderData.shippingAddress.state_code,
          state_name: orderData.shippingAddress.state_code, // Use state_code as fallback
          country_code: orderData.shippingAddress.country_code,
          country_name: orderData.shippingAddress.country_code, // Use country_code as fallback
          zip: orderData.shippingAddress.zip,
          phone: orderData.shippingAddress.phone,
          email: orderData.shippingAddress.email,
        },
        items: printfulOrderItems,
        retail_costs: {
          currency: orderData.currency?.toUpperCase() || 'USD',
          subtotal: orderData.totalAmount,
          discount: '0.00',
          shipping: '0.00', // Shipping is calculated by Printful, but we need to provide initial value
          tax: '0.00', // Tax calculated by Stripe, Printful recalculates
          vat: '0.00',
          total: orderData.totalAmount,
        },
      }

      console.log('🚀 Submitting order to Printful:', JSON.stringify(printfulOrder, null, 2))
      const printfulResponse = await printful.createOrder(printfulOrder)
      console.log('✅ Printful order created successfully:', printfulResponse)

      // Send confirmation email to customer
      try {
        const { sendOrderConfirmationEmail } = await import('./email')
        await sendOrderConfirmationEmail({
          customerEmail: orderData.customerEmail,
          customerName: orderData.customerName,
          orderNumber: session.id,
          items: orderData.items.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
          totalAmount: orderData.totalAmount,
          shippingAddress: orderData.shippingAddress,
        })
        console.log('✅ Order confirmation email sent')
      } catch (emailError) {
        console.error('❌ Error sending confirmation email:', emailError)
        // Don't throw - email is not critical for order processing
      }

      // TODO: Save order to database with Printful order ID

    } catch (printfulError) {
      console.error('❌ Error creating Printful order:', printfulError)
      // Don't throw - we still want to mark payment as successful
      // Just log the error and handle it separately
    }

    return orderData
  } catch (error) {
    console.error('Error handling successful payment:', error)
    throw error
  }
}