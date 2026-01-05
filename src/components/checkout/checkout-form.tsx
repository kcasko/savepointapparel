'use client'

import { useState } from 'react'
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { motion } from 'framer-motion'
import { useCart } from '@/lib/context/cart-context'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

export default function CheckoutForm() {
  const stripe = useStripe()
  const elements = useElements()
  const { clearCart } = useCart()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setLoading(true)

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success`,
      },
      redirect: 'if_required',
    })

    if (error) {
      console.error('Payment failed:', error)
      toast.error(error.message || 'Payment failed')
      setLoading(false)
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      toast.success('🎮 Payment successful!')
      clearCart()
      router.push('/checkout/success')
    } else {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Payment Element with retro styling */}
      <div className="space-y-4">
        <PaymentElement 
          options={{
            layout: 'tabs',
          }}
        />
      </div>

      {/* Customer Information */}
      <div className="space-y-4">
        <h4 className="text-lg font-bold text-white font-retro">Contact Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="email"
            placeholder="Email address"
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none transition-colors"
            required
          />
          <input
            type="tel"
            placeholder="Phone number"
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Submit Button */}
      <motion.button
        type="submit"
        disabled={!stripe || loading}
        className="w-full retro-button disabled:opacity-50 disabled:cursor-not-allowed"
        whileHover={!loading ? { scale: 1.02 } : {}}
        whileTap={!loading ? { scale: 0.98 } : {}}
      >
        {loading ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="loading-spinner" />
            <span>Processing Payment...</span>
          </div>
        ) : (
          'Complete Order'
        )}
      </motion.button>

      {/* Security Notice */}
      <div className="text-center">
        <p className="text-gray-400 text-xs">
          🔒 Your payment information is secure and encrypted
        </p>
        <p className="text-gray-500 text-xs mt-1">
          Powered by Stripe • PCI DSS Compliant
        </p>
      </div>
    </form>
  )
}