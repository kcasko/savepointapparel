'use client'

import { motion } from 'framer-motion'
import { useCart } from '@/lib/context/cart-context'
import EmbeddedCheckout from '@/components/checkout/embedded-checkout'
import { useState } from 'react'
import Image from 'next/image'
import { Trash2, Plus, Minus, CreditCard } from 'lucide-react'
import toast from 'react-hot-toast'

export default function CheckoutPage() {
  const { items, total, updateQuantity, removeItem } = useCart()
  const [checkoutMode, setCheckoutMode] = useState<'summary' | 'payment'>('summary')

  const handleProceedToPayment = () => {
    if (items.length === 0) {
      toast.error('Your cart is empty!')
      return
    }
    setCheckoutMode('payment')
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen py-16">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="text-center">
            <div className="text-6xl mb-8 opacity-50">🛒</div>
            <h1 className="text-4xl font-bold text-white mb-4 font-retro">Your Cart is Empty</h1>
            <p className="text-gray-300 mb-8">Ready to start your retro gaming collection?</p>
            <motion.a
              href="/shop"
              className="retro-button inline-block"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Shopping
            </motion.a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 font-retro">
            Checkout
          </h1>
          <p className="text-gray-300">Review your order and complete your purchase</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-800 rounded-lg p-6 border border-cyan-400/30"
            >
              <h2 className="text-2xl font-bold text-white mb-6 font-retro">Your Items</h2>
              
              <div className="space-y-4">
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center space-x-4 p-4 bg-gray-700 rounded-lg"
                  >
                    {/* Product Image */}
                    <div className="relative w-20 h-20 bg-gray-600 rounded-lg overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <h3 className="text-white font-semibold">{item.name}</h3>
                      <p className="text-cyan-400 font-bold font-retro">${item.price.toFixed(2)}</p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 text-gray-400 hover:text-white transition-colors"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="text-white font-bold px-3">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 text-gray-400 hover:text-white transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    {/* Subtotal */}
                    <div className="text-white font-bold min-w-[80px] text-right">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            {checkoutMode === 'summary' ? (
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gray-800 rounded-lg p-6 border border-cyan-400/30 sticky top-8"
              >
                <h2 className="text-2xl font-bold text-white mb-6 font-retro">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-300">
                    <span>Subtotal ({items.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Shipping</span>
                    <span className="text-green-400">FREE</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Tax</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <div className="border-t border-gray-600 pt-4">
                    <div className="flex justify-between text-xl font-bold text-white font-retro">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <motion.button
                  onClick={handleProceedToPayment}
                  className="w-full retro-button flex items-center justify-center space-x-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <CreditCard size={20} />
                  <span>Proceed to Payment</span>
                </motion.button>

                <p className="text-gray-400 text-xs text-center mt-4">
                  Secure checkout • Stay on our site
                </p>
              </motion.div>
            ) : (
              <EmbeddedCheckout items={items} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}