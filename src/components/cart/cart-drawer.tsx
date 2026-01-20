'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react'
import { useCart } from '@/lib/context/cart-context'
import Link from 'next/link'

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, total, updateQuantity, removeItem, clearCart } = useCart()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Cart Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-gray-900 border-l border-cyan-400/30 z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ShoppingBag className="text-cyan-400" size={24} />
                  <h2 className="text-xl font-bold text-white font-retro">Your Cart</h2>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Close cart"
                  title="Close cart"
                >
                  <X size={24} />
                </button>
              </div>
              {items.length > 0 && (
                <p className="text-gray-400 text-sm mt-2">
                  {items.length} item{items.length !== 1 ? 's' : ''} in your cart
                </p>
              )}
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center h-full px-6 text-center"
                >
                  <div className="text-6xl mb-4 opacity-50">🛒</div>
                  <h3 className="text-xl font-bold text-white mb-2 font-retro">Your cart is empty</h3>
                  <p className="text-gray-400 mb-6">Ready to start shopping? Browse our retro collection!</p>
                  <Link
                    href="/shop"
                    onClick={onClose}
                    className="retro-button"
                  >
                    Start Shopping
                  </Link>
                </motion.div>
              ) : (
                <div className="p-6 space-y-4">
                  <AnimatePresence>
                    {items.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        className="flex items-center space-x-4 p-4 bg-gray-800 rounded-lg border border-gray-700 hover:border-cyan-400/30 transition-colors"
                      >
                        {/* Product Image */}
                        <div className="relative w-16 h-16 bg-gray-700 rounded-lg overflow-hidden">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-semibold text-sm truncate">{item.name}</h3>
                          {item.variant && (
                            <p className="text-gray-400 text-xs">Variant: {item.variant}</p>
                          )}
                          {item.size && (
                            <p className="text-gray-400 text-xs">Size: {item.size}</p>
                          )}
                          <p className="text-cyan-400 font-bold font-retro">${item.price.toFixed(2)}</p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 text-gray-400 hover:text-white transition-colors"
                            aria-label="Decrease quantity"
                            title="Decrease quantity"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="text-white font-bold min-w-[2rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 text-gray-400 hover:text-white transition-colors"
                            aria-label="Increase quantity"
                            title="Increase quantity"
                          >
                            <Plus size={16} />
                          </button>
                        </div>

                        {/* Remove Button */}
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                          aria-label="Remove item"
                          title="Remove item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Clear Cart Button */}
                  {items.length > 0 && (
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      onClick={clearCart}
                      className="w-full p-2 text-red-400 hover:text-red-300 transition-colors text-sm font-retro uppercase tracking-wide"
                    >
                      Clear Cart
                    </motion.button>
                  )}
                </div>
              )}
            </div>

            {/* Footer - Checkout */}
            {items.length > 0 && (
              <div className="p-6 border-t border-gray-700 bg-gray-800">
                <div className="space-y-4">
                  {/* Total */}
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-white font-retro">Total:</span>
                    <span className="text-xl font-bold text-cyan-400 font-retro">
                      ${total.toFixed(2)}
                    </span>
                  </div>

                  {/* Checkout Button */}
                  <Link
                    href="/checkout"
                    onClick={onClose}
                    className="w-full retro-button text-center block"
                  >
                    Checkout
                  </Link>

                  {/* Continue Shopping */}
                  <Link
                    href="/shop"
                    onClick={onClose}
                    className="w-full p-3 text-center text-white border border-gray-600 rounded-lg hover:border-cyan-400 transition-colors font-retro uppercase tracking-wide block"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}