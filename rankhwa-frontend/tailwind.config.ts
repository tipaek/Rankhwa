import type { Config } from 'tailwindcss';

// Tailwind configuration for the Rankhwa frontend.
// We opt in to dark mode via a class on the html tag. Colour
// values are defined via CSS variables in styles/theme.css so
// that switching themes at runtime simply swaps variable values.
export default <Partial<Config>>{
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{ts,tsx,js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--color-bg)',
        foreground: 'var(--color-fg)',
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
        muted: 'var(--color-muted)',
        card: 'var(--color-card)',
        border: 'var(--color-border)',
        success: '#4ade80',
        warning: '#facc15',
        error: '#ef4444',
        muted: 'var(--color-muted-foreground)',
        'muted-foreground': 'var(--color-muted-foreground)',
      },
      borderRadius: {
        sm: '0.125rem',
        md: '0.375rem',
        lg: '0.5rem',
      },
      transitionProperty: {
        height: 'height',
      }
    },
  },
  plugins: [],
};