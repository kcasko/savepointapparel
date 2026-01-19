'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { ShoppingCart } from 'lucide-react'
import { useCart } from '@/lib/context/cart-context'
import Link from 'next/link'
import toast from 'react-hot-toast'

interface ProductVariant {
  id: number
  sync_variant_id: number
  title?: string
  price?: number
  available?: boolean
  sku?: string
}

interface Product {
  id: number
  name: string
  price: number
  image: string
  description: string
  category: string
  variants?: ProductVariant[]
}

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()

  const handleAddToCart = () => {
    // Get the sync_variant_id from the first available variant
    const syncVariantId = product.variants?.[0]?.sync_variant_id

    addItem({
      id: product.id.toString(),
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      sync_variant_id: syncVariantId,
    })
    toast.success('🎮 Added to cart!')
  }

  return (
    <motion.div
      className="product-card retro-card group cursor-pointer"
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {/* Product Image */}
      <div className="relative overflow-hidden rounded-lg mb-4 aspect-square bg-gray-800">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-300"
        />
        
        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <motion.button
            type="button"
            onClick={handleAddToCart}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-4 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-cyan-400 hover:text-gray-900 transition-colors"
            title="Add to Cart"
          >
            <ShoppingCart size={24} />
          </motion.button>
        </div>

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-2 py-1 bg-gradient-to-r from-cyan-400 to-purple-500 text-white text-xs font-bold rounded font-retro uppercase tracking-wide">
            {product.category}
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className="space-y-3">
        <Link href={`/products/${product.id}`}>
          <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors font-retro line-clamp-2">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-gray-400 text-sm line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-cyan-400 font-retro">
            ${product.price.toFixed(2)}
          </div>
          
          <motion.button
            type="button"
            onClick={handleAddToCart}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25 font-retro uppercase text-sm tracking-wide"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Add to Cart
          </motion.button>
        </div>
      </div>

      {/* Hover Effect Glow */}
      <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none glow-effect" />
    </motion.div>
  )
}