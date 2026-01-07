import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        accent: {
          50: '#fdf4ff',
          100: '#fae8ff',
          200: '#f5d0fe',
          300: '#f0abfc',
          400: '#e879f9',
          500: '#d946ef',
          600: '#c026d3',
          700: '#a21caf',
          800: '#86198f',
          900: '#701a75',
        },
        retro: {
          cyan: '#00ffff',
          magenta: '#ff00ff',
          yellow: '#ffff00',
          green: '#00ff00',
          orange: '#ff8000',
          purple: '#8000ff',
        }
      },
      fontFamily: {
        'pixel': ['Courier New', 'monospace'],
        'retro': ['Space Mono', 'Courier New', 'monospace'],
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 3s infinite',
        'pixel-blink': 'pixel-blink 1s infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': {
            opacity: 1,
            boxShadow: '0 0 0 0 rgba(59, 130, 246, 0.7)',
          },
          '50%': {
            opacity: 0.8,
            boxShadow: '0 0 0 10px rgba(59, 130, 246, 0)',
          },
        },
        'pixel-blink': {
          '0%, 50%': { opacity: 1 },
          '51%, 100%': { opacity: 0.3 },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'retro-grid': `
          linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
        `,
      },
      backgroundSize: {
        'grid': '20px 20px',
      },
    },
  },
  plugins: [
    forms,
    typography,
  ],
};

export default config;