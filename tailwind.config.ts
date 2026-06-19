import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/lib/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#0B1120',
          'navy-light': '#111B2E',
          blue: '#1E3A5F',
          electric: '#2563EB',
          cyan: '#22D3EE',
          'cyan-light': '#67E8F9',
          silver: '#94A3B8',
          'silver-light': '#CBD5E1',
          white: '#F8FAFC',
          ice: '#E0F2FE',
        },
      },
      backgroundImage: {
        'gradient-navy': 'linear-gradient(135deg, #0B1120 0%, #111B2E 50%, #1E3A5F 100%)',
        'gradient-electric': 'linear-gradient(135deg, #2563EB 0%, #22D3EE 100%)',
        'gradient-ice': 'linear-gradient(180deg, #E0F2FE 0%, #F8FAFC 100%)',
      },
      boxShadow: {
        'glow-cyan': '0 0 30px rgba(34, 211, 238, 0.2)',
        'glow-electric': '0 0 20px rgba(37, 99, 235, 0.3)',
      },
      animation: {
        'fade-up': 'fadeUp 0.5s ease-out forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
