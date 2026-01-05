'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { X, ShoppingBag, User, Search } from 'lucide-react'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const menuItems = [
    { href: '/shop', label: 'Shop All', icon: ShoppingBag },
    { href: '/collections', label: 'Collections', icon: Search },
    { href: '/about', label: 'About', icon: User },
    { href: '/contact', label: 'Contact', icon: User },
  ]

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

          {/* Menu */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
            className="fixed right-0 top-0 h-full w-80 max-w-sm bg-gray-900 border-l border-cyan-400/30 z-50"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-white font-retro">Menu</h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Navigation Items */}
              <nav className="space-y-4">
                {menuItems.map((item, index) => {
                  const Icon = item.icon
                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className="flex items-center space-x-3 p-3 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 transition-all duration-200 group"
                      >
                        <Icon size={20} className="group-hover:text-cyan-400 transition-colors" />
                        <span className="font-retro uppercase tracking-wide">{item.label}</span>
                      </Link>
                    </motion.div>
                  )
                })}
              </nav>

              {/* Divider */}
              <div className="my-8 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />

              {/* Additional Links */}
              <div className="space-y-3">
                <Link
                  href="/account"
                  onClick={onClose}
                  className="block text-gray-400 hover:text-white transition-colors font-retro uppercase tracking-wide text-sm"
                >
                  My Account
                </Link>
                <Link
                  href="/wishlist"
                  onClick={onClose}
                  className="block text-gray-400 hover:text-white transition-colors font-retro uppercase tracking-wide text-sm"
                >
                  Wishlist
                </Link>
                <Link
                  href="/support"
                  onClick={onClose}
                  className="block text-gray-400 hover:text-white transition-colors font-retro uppercase tracking-wide text-sm"
                >
                  Support
                </Link>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-gray-800 to-transparent">
              <div className="text-center">
                <p className="text-gray-400 text-xs mb-2 font-pixel">💾 GAME ON! 💾</p>
                <div className="h-0.5 bg-gradient-to-r from-cyan-400 to-purple-500 rounded" />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}