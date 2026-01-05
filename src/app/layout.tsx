import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/lib/context/cart-context'
import { Toaster } from 'react-hot-toast'
import Header from '@/components/layout/header'
import Footer from '@/components/layout/footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Save Point Apparel - Retro Gaming Fashion',
  description: '💾 RETRO NEVER DIED - IT JUST HIT SAVE 💾. Discover nostalgic gaming apparel that celebrates the golden age of gaming.',
  keywords: 'retro gaming, apparel, t-shirts, gaming fashion, nostalgia, pixel art',
  authors: [{ name: 'Save Point Apparel' }],
  openGraph: {
    title: 'Save Point Apparel - Retro Gaming Fashion',
    description: '💾 RETRO NEVER DIED - IT JUST HIT SAVE 💾',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Save Point Apparel',
    description: '💾 RETRO NEVER DIED - IT JUST HIT SAVE 💾',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900`}>
        <CartProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1f2937',
                color: '#00ffff',
                border: '1px solid #00ffff',
                fontFamily: 'Space Mono, monospace',
              },
              success: {
                iconTheme: {
                  primary: '#00ff00',
                  secondary: '#1f2937',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ff0000',
                  secondary: '#1f2937',
                },
              },
            }}
          />
        </CartProvider>
      </body>
    </html>
  )
}