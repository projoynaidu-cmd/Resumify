import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      xs: '380px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-dm-sans)', 'DM Sans', 'sans-serif'],
        serif: ['var(--font-playfair)', 'Playfair Display', 'serif'],
        mono: ['var(--font-dm-mono)', 'DM Mono', 'monospace'],
      },
      colors: {
        // Brand
        accent: {
          DEFAULT: 'var(--accent)',
          2: 'var(--accent2)',
          bg: 'var(--accent-bg)',
        },
        // App surface
        surface: {
          DEFAULT: 'var(--surface)',
          2: 'var(--surface2)',
        },
        app: {
          bg: 'var(--bg)',
          border: 'var(--border)',
          text: 'var(--text)',
          text2: 'var(--text2)',
          text3: 'var(--text3)',
        },
        // Resume design tokens
        resume: {
          accent: 'var(--resume-accent)',
          header: 'var(--resume-header)',
          text: 'var(--resume-text)',
          subtle: 'var(--resume-subtle)',
          border: 'var(--resume-border)',
          bg: 'var(--resume-bg)',
        },
      },
      borderRadius: {
        app: 'var(--radius)',
        'app-sm': 'var(--radius-sm)',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
      },
      transitionTimingFunction: {
        app: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      animation: {
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-in': 'slideIn 0.3s ease',
        spin: 'spin 0.85s linear infinite',
      },
      keyframes: {
        slideIn: {
          from: { opacity: '0', transform: 'translateX(20px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
