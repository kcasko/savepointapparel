import nodemailer from 'nodemailer'

interface OrderEmailData {
  customerEmail: string
  customerName: string
  orderNumber: string
  items: Array<{
    name: string
    quantity: number
    price: string
  }>
  totalAmount: string
  shippingAddress: {
    name: string
    address1: string
    address2?: string
    city: string
    state_code: string
    country_code: string
    zip: string
  }
}

// Create reusable transporter
let transporter: nodemailer.Transporter | null = null

function getTransporter() {
  if (!transporter) {
    if (!process.env.EMAIL_SERVER_HOST || !process.env.EMAIL_SERVER_USER || !process.env.EMAIL_SERVER_PASSWORD) {
      console.warn('Email configuration incomplete - emails will not be sent')
      return null
    }

    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    })
  }
  return transporter
}

export async function sendOrderConfirmationEmail(data: OrderEmailData) {
  const transport = getTransporter()
  
  if (!transport) {
    console.log('Email transporter not configured, skipping email send')
    return { success: false, error: 'Email not configured' }
  }

  const itemsList = data.items
    .map(
      (item) =>
        `<tr>
          <td style="padding: 12px; border-bottom: 1px solid #333; color: #ffffff;">${item.name}</td>
          <td style="padding: 12px; border-bottom: 1px solid #333; text-align: center; color: #ffffff;">${item.quantity}</td>
          <td style="padding: 12px; border-bottom: 1px solid #333; text-align: right; color: #ffffff;">$${item.price}</td>
        </tr>`
    )
    .join('')

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #1a1a1a;
          color: #ffffff;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #2a2a2a;
          padding: 40px;
        }
        .header {
          text-align: center;
          border-bottom: 3px solid #00ffff;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .logo {
          font-size: 32px;
          font-weight: bold;
          color: #00ffff;
          text-shadow: 2px 2px 4px rgba(0, 255, 255, 0.3);
        }
        .section {
          margin: 20px 0;
        }
        .section-title {
          color: #00ffff;
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 10px;
          text-transform: uppercase;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 15px 0;
        }
        th {
          background-color: #333;
          color: #00ffff;
          padding: 12px;
          text-align: left;
        }
        .total {
          font-size: 24px;
          font-weight: bold;
          color: #00ffff;
          text-align: right;
          margin-top: 20px;
        }
        .footer {
          text-align: center;
          margin-top: 40px;
          padding-top: 20px;
          border-top: 2px solid #333;
          color: #888;
          font-size: 12px;
        }
        .button {
          display: inline-block;
          background-color: #00ffff;
          color: #1a1a1a;
          padding: 12px 30px;
          text-decoration: none;
          font-weight: bold;
          border-radius: 5px;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">💾 SAVE POINT APPAREL</div>
          <p style="color: #888; margin: 10px 0 0 0;">Order Confirmation</p>
        </div>

        <p style="color: #ffffff;">Hey ${data.customerName}! 🎮</p>
        <p style="color: #ffffff;">Thanks for your order! Your retro gaming gear is on its way!</p>

        <div class="section">
          <div class="section-title">Order Details</div>
          <p style="color: #ffffff;"><strong>Order Number:</strong> ${data.orderNumber}</p>
          
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th style="text-align: center;">Quantity</th>
                <th style="text-align: right;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsList}
            </tbody>
          </table>

          <div class="total">Total: $${data.totalAmount}</div>
        </div>

        <div class="section">
          <div class="section-title">Shipping Address</div>
          <p style="color: #ffffff;">
            ${data.shippingAddress.name}<br>
            ${data.shippingAddress.address1}<br>
            ${data.shippingAddress.address2 ? `${data.shippingAddress.address2}<br>` : ''}
            ${data.shippingAddress.city}, ${data.shippingAddress.state_code} ${data.shippingAddress.zip}<br>
            ${data.shippingAddress.country_code}
          </p>
        </div>

        <div class="section">
          <div class="section-title">What's Next?</div>
          <p style="color: #ffffff;">📦 Your order is being prepared for shipment</p>
          <p style="color: #ffffff;">📧 You'll receive a tracking number within 24-48 hours</p>
          <p style="color: #ffffff;">🚚 Estimated delivery: 5-7 business days</p>
        </div>

        <div style="text-align: center;">
          <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/shop" class="button">
            Continue Shopping
          </a>
        </div>

        <div class="footer">
          <p>Questions? Reply to this email or contact us at support@savepointapparel.com</p>
          <p>💾 RETRO NEVER DIED - IT JUST HIT SAVE 💾</p>
        </div>
      </div>
    </body>
    </html>
  `

  const textContent = `
ORDER CONFIRMATION - SAVE POINT APPAREL

Hey ${data.customerName}!

Thanks for your order! Your retro gaming gear is on its way!

ORDER DETAILS
Order Number: ${data.orderNumber}

ITEMS:
${data.items.map((item) => `${item.name} x${item.quantity} - $${item.price}`).join('\n')}

TOTAL: $${data.totalAmount}

SHIPPING ADDRESS:
${data.shippingAddress.name}
${data.shippingAddress.address1}
${data.shippingAddress.address2 || ''}
${data.shippingAddress.city}, ${data.shippingAddress.state_code} ${data.shippingAddress.zip}
${data.shippingAddress.country_code}

WHAT'S NEXT?
- Your order is being prepared for shipment
- You'll receive a tracking number within 24-48 hours
- Estimated delivery: 5-7 business days

Questions? Reply to this email or contact us at support@savepointapparel.com

💾 RETRO NEVER DIED - IT JUST HIT SAVE 💾
  `

  try {
    const info = await transport.sendMail({
      from: `"Save Point Apparel" <${process.env.EMAIL_FROM}>`,
      to: data.customerEmail,
      subject: `🎮 Order Confirmation - ${data.orderNumber}`,
      text: textContent,
      html: htmlContent,
    })

    console.log('Order confirmation email sent:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Error sending order confirmation email:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export async function testEmailConnection() {
  const transport = getTransporter()
  
  if (!transport) {
    return { success: false, error: 'Email not configured' }
  }

  try {
    await transport.verify()
    console.log('Email server connection verified')
    return { success: true }
  } catch (error) {
    console.error('Email server connection failed:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}
