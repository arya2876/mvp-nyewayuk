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
        sans: ['var(--font-inter)', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        // NyewaYuk brand colors (from Logo DNA)
        'nyewa': {
          'teal': '#00A99D',      // Primary - buttons, icons, highlights
          'blue': '#0054A6',      // Secondary - headers, footers, titles
          'orange': '#F15A24',    // Accent/CTA - action buttons, notifications
          'dark': '#1E293B',      // Dark mode background
          'darker': '#121212',    // Darker background option
          'light': '#f8fafc',
          // Legacy colors (for backward compatibility)
          'primary': '#00A99D',
          'secondary': '#0054A6',
          'accent': '#F15A24',
        }
      }
    },
  },
  plugins: [],
}
export default config
