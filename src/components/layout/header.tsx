'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ShoppingCart, Menu, Search, User } from 'lucide-react'
import { useCart } from '@/lib/context/cart-context'
import MobileMenu from './mobile-menu'
import CartDrawer from '../cart/cart-drawer'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { getTotalItems } = useCart()

  const totalItems = getTotalItems()

  return (
    <>
      <header className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-md border-b border-cyan-400/30">
        <div className="container mx-auto px-4">
          {/* Top Banner */}
          <div className="py-2 text-center bg-gradient-to-r from-purple-600 to-pink-600">
            <p className="text-white text-sm font-retro uppercase tracking-wide">
              💾 RETRO NEVER DIED - IT JUST HIT SAVE 💾
            </p>
          </div>
          
          {/* Main Header */}
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <motion.div 
                className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-white font-bold text-xl font-pixel">💾</span>
              </motion.div>
              <div>
                <h1 className="text-xl font-bold text-white font-retro">Save Point Apparel</h1>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                href="/shop"
                className="text-white hover:text-cyan-400 transition-colors font-retro uppercase tracking-wide"
              >
                Shop
              </Link>
              <Link
                href="/collections"
                className="text-white hover:text-cyan-400 transition-colors font-retro uppercase tracking-wide"
              >
                Collections
              </Link>
              <Link
                href="/about"
                className="text-white hover:text-cyan-400 transition-colors font-retro uppercase tracking-wide"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-white hover:text-cyan-400 transition-colors font-retro uppercase tracking-wide"
              >
                Contact
              </Link>
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              <button className="text-white hover:text-cyan-400 transition-colors p-2">
                <Search size={20} />
              </button>

              {/* Account */}
              <Link href="/account" className="text-white hover:text-cyan-400 transition-colors p-2">
                <User size={20} />
              </Link>

              {/* Cart */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative text-white hover:text-cyan-400 transition-colors p-2"
              >
                <ShoppingCart size={20} />
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </button>

              {/* Mobile Menu Toggle */}
              <button
                className="md:hidden text-white hover:text-cyan-400 transition-colors p-2"
                onClick={() => setIsMenuOpen(true)}
              >
                <Menu size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      
      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  )
}