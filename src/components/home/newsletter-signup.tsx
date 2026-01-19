'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Send } from 'lucide-react'
import toast from 'react-hot-toast'

export default function NewsletterSignup() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to subscribe')
      }

      if (data.alreadySubscribed) {
        toast.success('🎮 You\'re already part of the squad!')
      } else {
        toast.success('🎮 Welcome to the squad! Check your email for exclusive drops!')
      }
      setEmail('')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Oops! Something went wrong. Try again!'
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="py-16 bg-gradient-to-r from-cyan-900/20 to-purple-900/20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Header */}
          <div className="mb-12">
            <motion.div
              className="text-6xl mb-6"
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0] 
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              💾
            </motion.div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-retro">
              Save Your Progress
            </h2>
            
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Sign up to get early drop alerts and secret discounts. 
              <br className="hidden md:block" />
              No spam, no loot boxes, just pure nostalgia.
            </p>
          </div>

          {/* Newsletter Form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-md mx-auto"
          >
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full pl-10 pr-24 py-4 bg-gray-800 border-2 border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none transition-colors font-retro"
                required
              />
              
              <motion.button
                type="submit"
                disabled={isSubmitting || !email}
                className="absolute inset-y-0 right-0 flex items-center justify-center px-6 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold rounded-r-lg transition-all duration-300 hover:from-cyan-400 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isSubmitting ? (
                  <div className="loading-spinner" />
                ) : (
                  <Send size={20} />
                )}
              </motion.button>
            </div>
          </motion.form>

          {/* Benefits */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
          >
            {[
              { icon: '🚀', text: 'Early Access to New Drops' },
              { icon: '💰', text: 'Exclusive Subscriber Discounts' },
              { icon: '🎁', text: 'Special Gaming Collectibles' }
            ].map((benefit, index) => (
              <motion.div
                key={benefit.text}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                className="flex flex-col items-center p-4 bg-white/5 rounded-lg border border-gray-700"
              >
                <div className="text-3xl mb-2">{benefit.icon}</div>
                <p className="text-gray-300 text-sm font-pixel text-center">{benefit.text}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-8 text-center"
          >
            <p className="text-gray-400 text-sm mb-2">
              Join 10,000+ retro gamers already subscribed
            </p>
            <div className="flex justify-center items-center space-x-2">
              <div className="flex -space-x-1">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 border-2 border-gray-800 flex items-center justify-center text-white text-xs font-bold"
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <span className="text-gray-400 text-sm">and more...</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}