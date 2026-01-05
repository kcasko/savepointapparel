# Save Point Apparel - Custom E-commerce Website

A modern, self-hosted e-commerce website built with Next.js, featuring Printify integration for print-on-demand fulfillment and Stripe for secure payment processing. Designed with a retro gaming theme that matches the original Save Point Apparel aesthetic.

## 🎮 Features

- **Modern Stack**: Next.js 14, TypeScript, Tailwind CSS
- **E-commerce Functionality**: Shopping cart, checkout, order management
- **Payment Processing**: Stripe integration with webhook support
- **Print-on-Demand**: Printify API integration for automatic fulfillment
- **Responsive Design**: Mobile-first, retro gaming themed UI
- **Self-Hosting Ready**: Docker configuration included
- **Performance Optimized**: Image optimization, lazy loading, animations

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Stripe account (for payments)
- Printify account (for products and fulfillment)

### Environment Setup

1. Clone this repository
2. Copy `.env.example` to `.env.local`
3. Fill in your configuration values:

```bash
# Stripe Configuration
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Printify Configuration
PRINTIFY_API_TOKEN=your_printify_api_token_here
PRINTIFY_SHOP_ID=your_printify_shop_id_here

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME="Save Point Apparel"
```

### Installation & Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Visit `http://localhost:3000` to see your store!

## 🔧 Configuration

### Stripe Setup

1. Create a [Stripe account](https://stripe.com)
2. Get your API keys from the Stripe Dashboard
3. Set up webhook endpoints:
   - Endpoint URL: `https://yourdomain.com/api/webhooks/stripe`
   - Events to listen for:
     - `checkout.session.completed`
     - `checkout.session.expired`
     - `payment_intent.succeeded`
     - `payment_intent.payment_failed`

### Printify Setup

1. Create a [Printify account](https://printify.com)
2. Create a store/shop in Printify
3. Generate API token in your Printify account settings
4. Get your Shop ID from the Printify dashboard
5. Add products to your Printify catalog

### Domain Configuration

Update the following for your domain:

1. Update `NEXT_PUBLIC_SITE_URL` in your environment variables
2. Configure your Stripe webhook endpoint URL
3. Update any hardcoded URLs in the code

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── api/               # API routes
│   │   ├── checkout/      # Stripe checkout
│   │   ├── products/      # Product API
│   │   └── webhooks/      # Webhook handlers
│   ├── checkout/          # Checkout pages
│   ├── shop/              # Shop pages
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── cart/              # Shopping cart components
│   ├── home/              # Homepage sections
│   ├── layout/            # Layout components
│   └── products/          # Product components
├── lib/                   # Utilities and configurations
│   ├── context/           # React contexts
│   ├── printify.ts        # Printify API integration
│   └── stripe.ts          # Stripe integration
└── styles/               # Global styles
```

## 🐳 Docker Deployment

### Using Docker Compose (Recommended)

1. Create a `docker-compose.yml`:

```yaml
version: '3.8'

services:
  savepoint-apparel:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    env_file:
      - .env.local
    restart: unless-stopped
```

2. Deploy:

```bash
docker-compose up -d
```

### Using Docker directly

```bash
# Build the image
docker build -t savepoint-apparel .

# Run the container
docker run -p 3000:3000 --env-file .env.local savepoint-apparel
```

## 🌐 Production Deployment

### Option 1: VPS/Cloud Server

1. Set up a Linux server (Ubuntu/Debian recommended)
2. Install Docker and Docker Compose
3. Clone your repository
4. Configure your environment variables
5. Set up a reverse proxy (nginx) with SSL
6. Deploy using Docker Compose

### Option 2: Platform Deployment

Deploy to platforms like:
- **Vercel** (Easy Next.js deployment)
- **Railway** (Docker support)
- **DigitalOcean App Platform**
- **AWS/Google Cloud/Azure**

## 📦 Adding Products

The site automatically syncs with your Printify catalog. To add products:

1. Create products in your Printify dashboard
2. Ensure they're published to your store
3. Products will appear automatically in your website

To customize product display:
- Edit `/src/app/api/products/route.ts` for product fetching logic
- Modify `/src/components/products/product-card.tsx` for product display
- Update `/src/lib/printify.ts` for product transformation

## 🎨 Customization

### Theme Colors

Edit `/tailwind.config.js` to change the color scheme:

```js
theme: {
  extend: {
    colors: {
      primary: { ... },
      accent: { ... },
      retro: { ... }
    }
  }
}
```

### Fonts

The site uses retro gaming fonts:
- **Space Mono** (retro text)
- **Courier New** (pixel text)

### Animations

Built with Framer Motion for smooth animations. Customize in individual components.

## 🛠️ Development

### Adding New Pages

1. Create page in `/src/app/your-page/page.tsx`
2. Add navigation links in header component
3. Update sitemap if needed

### Adding New API Endpoints

1. Create route in `/src/app/api/your-endpoint/route.ts`
2. Follow existing patterns for error handling
3. Add proper TypeScript types

### Testing Payments

Use Stripe test cards:
- `4242424242424242` (Visa - succeeds)
- `4000000000000002` (Card declined)
- Use any future date for expiry, any 3 digits for CVC

## 🐛 Troubleshooting

### Common Issues

1. **Stripe webhook errors**: Check endpoint URL and webhook secret
2. **Printify API errors**: Verify API token and shop ID
3. **Build errors**: Check TypeScript errors and dependencies
4. **Images not loading**: Verify image domains in `next.config.js`

### Support

- Check the GitHub issues for common problems
- Review logs for error details
- Ensure all environment variables are set correctly

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**Built with ❤️ for retro gaming fans**

*Save Point Apparel - Where retro never died, it just hit save! 💾*