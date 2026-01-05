'use client'

import { motion } from 'framer-motion'

export default function RetroSection() {
  return (
    <section className="py-16 bg-gradient-to-r from-purple-900/50 to-pink-900/50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-retro-grid bg-grid"></div>
      </div>
      
      {/* Floating Icons */}
      <div className="absolute inset-0">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-4xl opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 10, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          >
            {['🎮', '👾', '🕹️', '💾', '🎯', '⭐', '🏆', '🔥'][i]}
          </motion.div>
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div>
              <motion.h2 
                className="text-4xl md:text-5xl font-bold text-white mb-6 font-retro"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                Why Choose{' '}
                <span className="bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent">
                  Save Point?
                </span>
              </motion.h2>
              
              <motion.p
                className="text-xl text-gray-300 leading-relaxed"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                We&apos;re not just another apparel brand. We&apos;re gamers, nostalgics, and dreamers 
                who understand that some things never go out of style.
              </motion.p>
            </div>

            <div className="space-y-6">
              {[
                {
                  icon: '🎨',
                  title: 'Original Designs',
                  description: 'Every design is crafted with love for the golden age of gaming'
                },
                {
                  icon: '⚡',
                  title: 'Premium Quality',
                  description: 'High-quality materials that level up your comfort and style'
                },
                {
                  icon: '🚀',
                  title: 'Fast Delivery',
                  description: 'Get your gear fast with our lightning-quick shipping'
                }
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  className="flex items-start space-x-4 p-4 rounded-lg bg-white/5 backdrop-blur-sm border border-cyan-400/20 hover:border-cyan-400/40 transition-all duration-300"
                >
                  <div className="text-3xl">{feature.icon}</div>
                  <div>
                    <h3 className="text-lg font-bold text-white font-retro">{feature.title}</h3>
                    <p className="text-gray-300">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Content - Interactive Gaming Console */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="retro-card max-w-md mx-auto">
              <div className="space-y-6">
                <div className="text-center">
                  <motion.div
                    className="text-6xl mb-4"
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0] 
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    🎮
                  </motion.div>
                  <h3 className="text-2xl font-bold text-white font-retro mb-2">Game Stats</h3>
                  <p className="text-gray-300">Your retro fashion journey</p>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 font-pixel">Style Level:</span>
                    <span className="text-cyan-400 font-bold">∞</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 font-pixel">Nostalgia:</span>
                    <span className="text-pink-400 font-bold">MAX</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 font-pixel">Retro Power:</span>
                    <span className="text-purple-400 font-bold">OVER 9000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 font-pixel">Achievement:</span>
                    <span className="text-yellow-400 font-bold">UNLOCKED</span>
                  </div>
                </div>

                <motion.button
                  className="w-full retro-button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  CONTINUE?
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}