import prisma from './db'
import { Prisma } from '@prisma/client'

export interface CreateOrderData {
  stripeSessionId: string
  printfulOrderId?: string
  customerEmail: string
  customerName: string
  customerPhone?: string
  totalAmount: number
  currency: string
  paymentStatus: string
  items: Array<{
    productId: string
    productName: string
    syncVariantId?: number
    quantity: number
    price: number
  }>
  shippingAddress: {
    name: string
    address1: string
    address2?: string
    city: string
    stateCode: string
    countryCode: string
    zip: string
    phone?: string
  }
}

/**
 * Create a new order in the database
 */
export async function createOrder(data: CreateOrderData) {
  try {
    const order = await prisma.order.create({
      data: {
        stripeSessionId: data.stripeSessionId,
        printfulOrderId: data.printfulOrderId,
        customerEmail: data.customerEmail,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        totalAmount: new Prisma.Decimal(data.totalAmount),
        currency: data.currency,
        paymentStatus: data.paymentStatus,
        items: {
          create: data.items.map(item => ({
            productId: item.productId,
            productName: item.productName,
            syncVariantId: item.syncVariantId,
            quantity: item.quantity,
            price: new Prisma.Decimal(item.price),
          })),
        },
        shippingAddress: {
          create: {
            name: data.shippingAddress.name,
            address1: data.shippingAddress.address1,
            address2: data.shippingAddress.address2,
            city: data.shippingAddress.city,
            stateCode: data.shippingAddress.stateCode,
            countryCode: data.shippingAddress.countryCode,
            zip: data.shippingAddress.zip,
            phone: data.shippingAddress.phone,
          },
        },
      },
      include: {
        items: true,
        shippingAddress: true,
      },
    })

    console.log(`Order created in database: ${order.id}`)
    return order
  } catch (error) {
    console.error('Error creating order in database:', error)
    throw error
  }
}

/**
 * Update order with Printful order ID
 */
export async function updateOrderWithPrintfulId(stripeSessionId: string, printfulOrderId: string) {
  try {
    const order = await prisma.order.update({
      where: { stripeSessionId },
      data: {
        printfulOrderId,
        status: 'PROCESSING',
      },
    })
    return order
  } catch (error) {
    console.error('Error updating order with Printful ID:', error)
    throw error
  }
}

/**
 * Get order by Stripe session ID
 */
export async function getOrderByStripeSessionId(stripeSessionId: string) {
  return prisma.order.findUnique({
    where: { stripeSessionId },
    include: {
      items: true,
      shippingAddress: true,
    },
  })
}

/**
 * Get orders by customer email
 */
export async function getOrdersByCustomerEmail(email: string) {
  return prisma.order.findMany({
    where: { customerEmail: email },
    include: {
      items: true,
      shippingAddress: true,
    },
    orderBy: { createdAt: 'desc' },
  })
}

/**
 * Update order status
 */
export async function updateOrderStatus(orderId: string, status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED') {
  return prisma.order.update({
    where: { id: orderId },
    data: { status },
  })
}
