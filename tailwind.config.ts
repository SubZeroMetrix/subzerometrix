import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    // Wave 7: tone/state class fragments live in src/lib/ui — scan them so they aren't purged.
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy:    '#0A1628',
          blue:    '#0D2B5C',
          mid:     '#1A4080',
          silver:  '#A8B8CC',
          light:   '#D4E0EE',
          white:   '#F4F7FB',
          accent:  '#4A90D9',
          ice:     '#E8F0F9',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        body:    ['var(--font-body)', 'sans-serif'],
        mono:    ['var(--font-mono)', 'monospace'],
      },
      backgroundImage: {
        'gradient-navy': 'linear-gradient(135deg, #0A1628 0%, #0D2B5C 50%, #1A4080 100%)',
        'gradient-ice':  'linear-gradient(180deg, #E8F0F9 0%, #F4F7FB 100%)',
        'gradient-steel':'linear-gradient(135deg, #1A4080 0%, #A8B8CC 100%)',
      },
      boxShadow: {
        'glow-blue': '0 0 30px rgba(74, 144, 217, 0.3)',
        'glow-silver': '0 0 20px rgba(168, 184, 204, 0.2)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-up': 'fadeUp 0.6s ease-out forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
