import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#EDF1F8',
          100: '#D1DDEF',
          200: '#A3BBE0',
          300: '#6B91CC',
          400: '#3D6DB5',
          500: '#2A5599',
          600: '#1E4175',
          700: '#163058',
          800: '#0F2240',
          900: '#0A1628',
          950: '#060E1A',
        },
        gold: {
          50: '#FBF7EE',
          100: '#F8F0DE',
          200: '#F2E3C1',
          300: '#EAD19A',
          400: '#E0BD72',
          500: '#D4A853',
          600: '#B8822A',
          700: '#9A6A1C',
          800: '#7A5214',
          900: '#5C3D0E',
        },
        neutral: {
          50: '#F6F5F2',
          100: '#EDEAE6',
          200: '#DCD9D4',
          300: '#C2BEB8',
          400: '#9C9890',
          500: '#78736A',
          600: '#5C5850',
          700: '#44403A',
          800: '#2E2B25',
          900: '#1A1814',
          950: '#0C0B09',
        },
        success: {
          50: '#ECFDF1',
          500: '#2D7D46',
        },
        warning: {
          50: '#FFFBEB',
          500: '#B45309',
        },
        error: {
          50: '#FEF2F2',
          500: '#DC2626',
        },
        info: {
          50: '#EFF6FF',
          500: '#2563EB',
        },
        surface: {
          page: 'var(--surface-page)',
          card: 'var(--surface-card)',
          elevated: 'var(--surface-elevated)',
          overlay: 'var(--surface-overlay)',
          subtle: 'var(--surface-subtle)',
        },
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        destructive: {
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--destructive-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'Playfair Display', 'Georgia', 'serif'],
        body: ['var(--font-body)', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'JetBrains Mono', 'Consolas', 'monospace'],
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1.5', letterSpacing: '0.02em' }],
        sm: ['0.875rem', { lineHeight: '1.5', letterSpacing: '0.01em' }],
        base: ['1rem', { lineHeight: '1.625', letterSpacing: '0' }],
        lg: ['1.125rem', { lineHeight: '1.6', letterSpacing: '-0.005em' }],
        xl: ['1.25rem', { lineHeight: '1.5', letterSpacing: '-0.01em' }],
        '2xl': ['1.5rem', { lineHeight: '1.4', letterSpacing: '-0.015em' }],
        '3xl': ['1.875rem', { lineHeight: '1.3', letterSpacing: '-0.02em' }],
        '4xl': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.025em' }],
        '5xl': ['3rem', { lineHeight: '1.15', letterSpacing: '-0.03em' }],
        '6xl': ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.035em' }],
        '7xl': ['4.5rem', { lineHeight: '1.05', letterSpacing: '-0.04em' }],
      },
      boxShadow: {
        'elevation-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.04)',
        'elevation-md': '0 2px 8px -2px rgba(0, 0, 0, 0.08)',
        'elevation-lg': '0 8px 24px -4px rgba(0, 0, 0, 0.10)',
        'elevation-xl': '0 16px 48px -8px rgba(0, 0, 0, 0.14)',
      },
      zIndex: {
        base: '0',
        raised: '10',
        dropdown: '100',
        sticky: '200',
        overlay: '300',
        modal: '400',
        toast: '500',
      },
      maxWidth: {
        'container-sm': '640px',
        'container-md': '768px',
        'container-lg': '1024px',
        'container-xl': '1280px',
        'container-2xl': '1440px',
      },
      gap: {
        'gutter-mobile': '16px',
        'gutter-tablet': '24px',
        'gutter-desktop': '32px',
      },
      padding: {
        'margin-mobile': '16px',
        'margin-tablet': '32px',
        'margin-desktop': '48px',
      },
      spacing: {
        '4.5': '1.125rem',
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '120px': '120px',
        '160px': '160px',
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;
