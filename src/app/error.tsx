'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <motion.div
          className="text-8xl mb-8"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, -5, 5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          💥
        </motion.div>

        <h1 className="text-4xl font-bold text-white mb-4 font-retro">
          Game Over!
        </h1>

        <p className="text-gray-400 mb-8 text-lg">
          Something went wrong, but don&apos;t worry - your progress has been saved.
          Insert coin to continue.
        </p>

        <div className="space-y-4">
          <button
            type="button"
            onClick={reset}
            className="retro-button w-full"
          >
            Continue
          </button>

          <a
            href="/"
            className="block px-6 py-3 bg-gray-700 text-white font-bold rounded-lg transition-all duration-300 hover:bg-gray-600 font-retro uppercase tracking-wide"
          >
            Return to Title Screen
          </a>
        </div>

        {process.env.NODE_ENV === 'development' && error.message && (
          <div className="mt-8 p-4 bg-red-900/20 border border-red-500/30 rounded-lg text-left">
            <p className="text-red-400 text-sm font-mono break-all">
              {error.message}
            </p>
          </div>
        )}
      </motion.div>
    </div>
  )
}
