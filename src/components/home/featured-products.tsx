'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ProductCard from '@/components/products/product-card'
import Link from 'next/link'

interface Product {
  id: number
  name: string
  price: number
  image: string
  description: string
  category: string
  variants?: Array<{
    id: number
    sync_variant_id: number
    [key: string]: any
  }>
}

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeaturedProducts()
  }, [])

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true)
      
      const response = await fetch('/api/products?limit=4')
      
      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }

      const data = await response.json()
      setProducts(data.products || [])
    } catch (err) {
      console.error('Error fetching featured products:', err)
      
      // Fallback to mock data if API fails
      setProducts([
        {
          id: 1,
          name: 'Cozy Gamer Vibes Kids Tee',
          price: 17.00,
          image: 'https://via.placeholder.com/400x400/1a1a1a/00ffff?text=Gamer+Tee',
          description: 'Perfect for young gamers who love retro vibes',
          category: 'Kids'
        },
        {
          id: 2,
          name: 'Bubble-free Stickers',
          price: 2.50,
          image: 'https://via.placeholder.com/400x400/1a1a1a/ff00ff?text=Stickers',
          description: 'High-quality gaming stickers for your setup',
          category: 'Accessories'
        },
        {
          id: 3,
          name: 'Retro Gaming Hoodie',
          price: 45.00,
          image: 'https://via.placeholder.com/400x400/1a1a1a/00ff00?text=Hoodie',
          description: 'Stay cozy while gaming with this retro hoodie',
          category: 'Hoodies'
        },
        {
          id: 4,
          name: 'Pixel Art Fanny Pack',
          price: 25.00,
          image: 'https://via.placeholder.com/400x400/1a1a1a/ffff00?text=Fanny+Pack',
          description: 'Carry your essentials in retro style',
          category: 'Accessories'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 font-retro">
              Featured Products
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-800 rounded-lg p-4 animate-pulse">
                <div className="w-full h-64 bg-gray-700 rounded-lg mb-4"></div>
                <div className="h-6 bg-gray-700 rounded mb-2"></div>
                <div className="h-4 bg-gray-700 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 font-retro">
            Featured Products
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Check out our most popular retro gaming apparel and accessories
          </p>
        </motion.div>

        {/* Products Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12"
        >
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center"
        >
          <Link
            href="/shop"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white border-2 border-cyan-400 rounded-lg transition-all duration-300 hover:bg-cyan-400 hover:text-gray-900 font-retro uppercase tracking-wide group"
          >
            View All Products
            <motion.span
              className="ml-2"
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.span>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}