/**
 * Email Test Script
 * Tests the email configuration and sends a sample order confirmation
 */

// Load environment variables from .env.local
import { config } from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

config({ path: join(__dirname, '.env.local') })

// Import the email module
async function testEmail() {
  console.log('🧪 Testing email configuration...\n')
  
  // Verify env vars are loaded
  console.log('📧 Email configured for:', process.env.EMAIL_SERVER_USER || 'NOT SET')
  console.log('🔧 SMTP Host:', process.env.EMAIL_SERVER_HOST || 'NOT SET')
  console.log('')
  
  try {
    // Dynamically import the email module (TypeScript)
    const { sendOrderConfirmationEmail, testEmailConnection } = await import('./src/lib/email.ts')
    
    // First, test the connection
    console.log('1️⃣  Testing SMTP connection...')
    await testEmailConnection()
    console.log('✅ SMTP connection successful!\n')
    
    // Send a test order confirmation
    console.log('2️⃣  Sending test order confirmation email...')
    await sendOrderConfirmationEmail({
      customerEmail: 'keith.casko@gmail.com', // Send to yourself for testing
      customerName: 'Keith Casko',
      orderNumber: 'test_' + Date.now(),
      items: [
        {
          name: 'Retro Gaming "Save Point" T-Shirt',
          quantity: 2,
          price: 2999, // $29.99 in cents
        },
        {
          name: 'Pixel Heart Pom-Pom Beanie',
          quantity: 1,
          price: 1999, // $19.99 in cents
        },
      ],
      totalAmount: 7997, // $79.97 in cents
      shippingAddress: {
        name: 'Keith Casko',
        address1: '123 Gamer Street',
        city: 'Portland',
        state_code: 'OR',
        country_code: 'US',
        zip: '97201',
      },
    })
    
    console.log('✅ Test email sent successfully!\n')
    console.log('📧 Check your inbox at keith.casko@gmail.com\n')
    console.log('🎮 Email should have a retro gaming theme with cyan (#00ffff) colors\n')
    
  } catch (error) {
    console.error('❌ Email test failed:', error)
    console.error('\nTroubleshooting:')
    console.error('1. Verify your Gmail App Password is correct in .env.local')
    console.error('2. Make sure 2-Step Verification is enabled on your Google account')
    console.error('3. Check that EMAIL_SERVER_USER matches your Gmail address')
    console.error('4. Ensure no firewall is blocking SMTP port 587\n')
    process.exit(1)
  }
}

testEmail()
