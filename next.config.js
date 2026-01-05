/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: [
      'files.cdn.printful.com',
      'printful.com',
      'via.placeholder.com',
      'unsplash.com',
      'cdn.shopify.com'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.printful.com',
      },
      {
        protocol: 'https',
        hostname: '**.cdn.printful.com',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  },
}

module.exports = nextConfig