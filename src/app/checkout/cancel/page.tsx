'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ShoppingCart, ArrowLeft } from 'lucide-react'

export default function CheckoutCancelPage() {
  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          {/* Cancel Animation */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 10 }}
            className="w-24 h-24 bg-gradient-to-r from-gray-600 to-gray-500 rounded-full flex items-center justify-center mx-auto mb-8"
          >
            <ShoppingCart size={48} className="text-white" />
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-retro">
            Checkout Cancelled
          </h1>
          
          <p className="text-xl text-gray-300 mb-8">
            No worries! Your items are still waiting for you in your cart.
          </p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            <Link
              href="/shop"
              className="retro-button inline-flex items-center space-x-2"
            >
              <ArrowLeft size={20} />
              <span>Continue Shopping</span>
            </Link>
            
            <div className="text-center">
              <p className="text-gray-400 text-sm">
                Need help with checkout?{' '}
                <Link href="/contact" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                  Contact Support
                </Link>
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}