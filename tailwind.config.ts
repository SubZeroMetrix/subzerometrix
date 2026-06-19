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
          navy: '#060918',
          'navy-light': '#0C1425',
          'navy-mid': '#111D33',
          blue: '#1A2F50',
          electric: '#2563EB',
          cyan: '#22D3EE',
          'cyan-light': '#67E8F9',
          silver: '#94A3B8',
          'silver-light': '#CBD5E1',
          white: '#F8FAFC',
          ice: '#E0F2FE',
          green: '#10B981',
        },
        surface: {
          light: '#FFFFFF',
          'light-alt': '#F8FAFC',
          'light-muted': '#F1F5F9',
          border: '#E2E8F0',
          'border-light': '#F1F5F9',
        },
      },
      fontFamily: {
        display: ['Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-navy': 'linear-gradient(135deg, #060918 0%, #0C1425 50%, #111D33 100%)',
        'gradient-electric': 'linear-gradient(135deg, #2563EB 0%, #22D3EE 100%)',
        'gradient-ice': 'linear-gradient(180deg, #E0F2FE 0%, #F8FAFC 100%)',
        'gradient-surface': 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)',
        'gradient-hero': 'radial-gradient(ellipse at 50% 0%, rgba(37,99,235,0.12) 0%, rgba(6,9,24,0) 70%)',
      },
      boxShadow: {
        panel: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)',
        'panel-lg': '0 4px 16px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)',
        'panel-xl': '0 8px 32px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)',
        'glow-cyan': '0 0 40px rgba(34, 211, 238, 0.15)',
        'glow-electric': '0 0 40px rgba(37, 99, 235, 0.15)',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'slide-in-right': 'slideInRight 0.5s ease-out forwards',
        'pulse-slow': 'pulse 4s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
