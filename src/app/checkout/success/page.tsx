'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { CheckCircle, Package, Truck, Mail } from 'lucide-react'
import Link from 'next/link'
import { useCart } from '@/lib/context/cart-context'

function CheckoutSuccessContent() {
  const searchParams = useSearchParams()
  const { clearCart } = useCart()
  const [sessionId, setSessionId] = useState<string | null>(null)

  useEffect(() => {
    const sessionIdParam = searchParams.get('session_id')
    setSessionId(sessionIdParam)
    
    // Clear the cart after successful checkout
    if (sessionIdParam) {
      clearCart()
    }
  }, [searchParams, clearCart])

  const steps = [
    {
      icon: CheckCircle,
      title: 'Payment Confirmed',
      description: 'Your order has been successfully processed',
      completed: true
    },
    {
      icon: Package,
      title: 'Order Processing',
      description: 'Your items are being prepared for shipping',
      completed: true
    },
    {
      icon: Truck,
      title: 'Shipping',
      description: 'Your order will be shipped within 3-5 business days',
      completed: false
    },
    {
      icon: Mail,
      title: 'Delivery',
      description: 'Estimated delivery: 7-10 business days',
      completed: false
    }
  ]

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          {/* Success Animation */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 10 }}
            className="w-24 h-24 bg-gradient-to-r from-green-400 to-cyan-400 rounded-full flex items-center justify-center mx-auto mb-8"
          >
            <CheckCircle size={48} className="text-white" />
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-retro">
            Order Confirmed!
          </h1>
          <p className="text-xl text-gray-300 mb-2">
            Thank you for your purchase! 🎮
          </p>
          {sessionId && (
            <p className="text-sm text-gray-400 font-pixel">
              Order ID: {sessionId.slice(-12).toUpperCase()}
            </p>
          )}
        </motion.div>

        {/* Order Status Steps */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-800 rounded-lg p-8 mb-8 border border-cyan-400/30"
        >
          <h2 className="text-2xl font-bold text-white mb-6 font-retro text-center">
            Order Status
          </h2>
          
          <div className="space-y-6">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-center space-x-4"
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    step.completed 
                      ? 'bg-gradient-to-r from-green-400 to-cyan-400' 
                      : 'bg-gray-700 border-2 border-gray-600'
                  }`}>
                    <Icon size={24} className={step.completed ? 'text-white' : 'text-gray-400'} />
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-bold ${step.completed ? 'text-white' : 'text-gray-400'} font-retro`}>
                      {step.title}
                    </h3>
                    <p className={`text-sm ${step.completed ? 'text-gray-300' : 'text-gray-500'}`}>
                      {step.description}
                    </p>
                  </div>
                  {step.completed && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                      className="text-green-400"
                    >
                      <CheckCircle size={20} />
                    </motion.div>
                  )}
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
        >
          <div className="retro-card">
            <div className="text-4xl mb-4">📧</div>
            <h3 className="text-lg font-bold text-white mb-2 font-retro">Check Your Email</h3>
            <p className="text-gray-300 text-sm">
              We&apos;ve sent you a confirmation email with your order details and tracking information.
            </p>
          </div>
          
          <div className="retro-card">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-lg font-bold text-white mb-2 font-retro">Track Your Order</h3>
            <p className="text-gray-300 text-sm">
              You&apos;ll receive tracking information within 24 hours once your order ships.
            </p>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link
            href="/shop"
            className="retro-button"
          >
            Continue Shopping
          </Link>
          
          <Link
            href="/account/orders"
            className="px-6 py-3 text-white border-2 border-white rounded-lg hover:bg-white hover:text-gray-900 transition-all duration-300 font-retro uppercase tracking-wide"
          >
            View Orders
          </Link>
        </motion.div>

        {/* Support Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-center mt-12 p-6 bg-gray-800/50 rounded-lg border border-gray-700"
        >
          <h3 className="text-lg font-bold text-white mb-2 font-retro">Need Help?</h3>
          <p className="text-gray-300 text-sm mb-4">
            Questions about your order? Our support team is here to help!
          </p>
          <Link
            href="/contact"
            className="text-cyan-400 hover:text-cyan-300 transition-colors font-retro uppercase text-sm"
          >
            Contact Support →
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    }>
      <CheckoutSuccessContent />
    </Suspense>
  )
}