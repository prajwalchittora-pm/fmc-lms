import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Manrope', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        ember: {
          DEFAULT: '#f97316',
          mid: '#fb923c',
          light: '#fdba74',
          soft: 'rgba(249,115,22,0.10)',
          border: 'rgba(249,115,22,0.22)',
          glow: 'rgba(249,115,22,0.28)',
        },
        cobalt: '#3B82F6',
        violet: '#8B5CF6',
        teal: '#14B8A6',
        rose: '#F43F5E',
        lime: '#84CC16',
      },
      borderRadius: {
        none: '0',
        sm: '0',
        DEFAULT: '0',
        md: '0',
        lg: '0',
        xl: '0',
        '2xl': '0',
        full: '9999px',
      },
      animation: {
        'fade-up': 'fadeUp 0.5s ease forwards',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'scratch-reveal': 'scratchReveal 1.5s ease forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        scratchReveal: {
          '0%': { clipPath: 'inset(0 100% 0 0)' },
          '100%': { clipPath: 'inset(0 0% 0 0)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
