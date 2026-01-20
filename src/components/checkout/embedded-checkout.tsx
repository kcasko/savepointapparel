'use client'

import { useState, useEffect } from 'react'
import { EmbeddedCheckoutProvider, EmbeddedCheckout as StripeEmbeddedCheckout } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { motion } from 'framer-motion'
import { csrfFetch } from '@/hooks/use-csrf'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface EmbeddedCheckoutProps {
  items: Array<{
    id: string
    name: string
    price: number
    quantity: number
    image: string
    sync_variant_id?: number
  }>
}

export default function EmbeddedCheckout({ items }: EmbeddedCheckoutProps) {
  const [clientSecret, setClientSecret] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    // Create checkout session when component mounts or items change
    createCheckoutSession()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items])

  const createCheckoutSession = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await csrfFetch('/api/checkout', {
        method: 'POST',
        body: JSON.stringify({
          items,
        }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to create checkout session')
      }

      const data = await response.json()
      setClientSecret(data.clientSecret)
    } catch (error) {
      console.error('Error creating checkout session:', error)
      const message = error instanceof Error ? error.message : 'Failed to initialize checkout. Please try again.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800 rounded-lg p-8 border border-cyan-400/30"
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-white">Loading checkout...</p>
        </div>
      </motion.div>
    )
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800 rounded-lg p-8 border border-red-400/30"
      >
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={createCheckoutSession}
            className="retro-button"
          >
            Try Again
          </button>
        </div>
      </motion.div>
    )
  }

  const options = { clientSecret }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 rounded-lg p-6 border border-cyan-400/30"
    >
      <h3 className="text-2xl font-bold text-white mb-6 font-retro">
        Payment & Shipping
      </h3>
      
      {clientSecret && (
        <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
          <StripeEmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      )}
    </motion.div>
  )
}