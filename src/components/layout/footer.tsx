'use client'

import Link from 'next/link'
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 border-t border-cyan-400/30 mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold font-pixel">💾</span>
              </div>
              <h3 className="text-xl font-bold text-white font-retro">Save Point Apparel</h3>
            </div>
            <p className="text-gray-300 text-sm">
              Bringing back the golden age of gaming through nostalgic apparel and accessories. 
              Level up your style with retro gaming fashion.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                <Facebook size={20} />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                <Instagram size={20} />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                <Twitter size={20} />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-white font-retro uppercase tracking-wide text-sm">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/shop" className="text-gray-300 hover:text-cyan-400 transition-colors text-sm">
                  Shop All
                </Link>
              </li>
              <li>
                <Link href="/collections/tshirts" className="text-gray-300 hover:text-cyan-400 transition-colors text-sm">
                  T-Shirts
                </Link>
              </li>
              <li>
                <Link href="/collections/hoodies" className="text-gray-300 hover:text-cyan-400 transition-colors text-sm">
                  Hoodies
                </Link>
              </li>
              <li>
                <Link href="/collections/accessories" className="text-gray-300 hover:text-cyan-400 transition-colors text-sm">
                  Accessories
                </Link>
              </li>
              <li>
                <Link href="/collections/stickers" className="text-gray-300 hover:text-cyan-400 transition-colors text-sm">
                  Stickers
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h4 className="text-white font-retro uppercase tracking-wide text-sm">Customer Service</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-cyan-400 transition-colors text-sm">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-300 hover:text-cyan-400 transition-colors text-sm">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-gray-300 hover:text-cyan-400 transition-colors text-sm">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-gray-300 hover:text-cyan-400 transition-colors text-sm">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link href="/size-guide" className="text-gray-300 hover:text-cyan-400 transition-colors text-sm">
                  Size Guide
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-white font-retro uppercase tracking-wide text-sm">Get in Touch</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-gray-300 text-sm">
                <Mail size={16} />
                <span>hello@savepointapparel.com</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300 text-sm">
                <Phone size={16} />
                <span>1-800-SAVEPOINT</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300 text-sm">
                <MapPin size={16} />
                <span>Gaming Universe, Level 1</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm text-center md:text-left">
              © {currentYear} Save Point Apparel. All rights reserved. | Built with ❤️ for retro gaming fans
            </div>
            <div className="flex space-x-6">
              <Link href="/privacy" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Retro Footer Effect */}
      <div className="h-1 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500"></div>
    </footer>
  )
}