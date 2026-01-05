'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-retro-grid bg-grid opacity-20"></div>
      
      {/* Floating Elements */}
      <div className="absolute inset-0">
        <motion.div
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 left-1/4 text-6xl opacity-30"
        >
          🎮
        </motion.div>
        <motion.div
          animate={{ 
            y: [0, -15, 0],
            rotate: [0, -5, 0]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
          className="absolute top-1/3 right-1/4 text-5xl opacity-30"
        >
          👾
        </motion.div>
        <motion.div
          animate={{ 
            y: [0, -10, 0],
            rotate: [0, 3, 0]
          }}
          transition={{ 
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute bottom-1/4 left-1/3 text-4xl opacity-30"
        >
          🕹️
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="space-y-8"
        >
          {/* Main Headline */}
          <div className="space-y-4">
            <motion.h1 
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-white font-retro leading-tight"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <span className="block mb-2">💾 SAVE POINT</span>
              <span className="block bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                APPAREL
              </span>
            </motion.h1>
            
            <motion.p
              className="text-xl md:text-2xl text-cyan-400 font-pixel tracking-wide"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              RETRO NEVER DIED - IT JUST HIT SAVE
            </motion.p>
          </div>

          {/* Description */}
          <motion.p
            className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            Level up your wardrobe with nostalgic gaming fashion. From pixel-perfect designs to 
            retro-inspired graphics, we&apos;ve got the gear to show your gaming heritage.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            <Link
              href="/shop"
              className="retro-button text-lg px-8 py-4 group"
            >
              <span className="relative">
                SHOP NOW
                <motion.span
                  className="absolute -right-2 opacity-0 group-hover:opacity-100"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.span>
              </span>
            </Link>
            
            <Link
              href="/collections"
              className="px-8 py-4 text-lg font-bold text-white border-2 border-white rounded-lg transition-all duration-300 hover:bg-white hover:text-gray-900 font-retro uppercase tracking-wide"
            >
              View Collections
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-gray-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-400 font-retro">100+</div>
              <div className="text-gray-400 uppercase text-sm tracking-wide">Retro Designs</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 font-retro">24/7</div>
              <div className="text-gray-400 uppercase text-sm tracking-wide">Fast Shipping</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-400 font-retro">∞</div>
              <div className="text-gray-400 uppercase text-sm tracking-wide">Gaming Nostalgia</div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-cyan-400 rounded-full flex justify-center">
          <motion.div
            className="w-1 h-3 bg-cyan-400 rounded-full mt-2"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  )
}