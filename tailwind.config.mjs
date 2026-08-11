/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        bg: '#F3F4F1',
        surface: '#FFFFFF',
        ink: '#101114',
        'ink-soft': '#1B1C20',
        text: {
          primary: '#101114',
          secondary: '#6B6D72',
          inverse: '#FFFFFF',
          'inverse-muted': '#9A9CA3',
        },
        accent: {
          DEFAULT: '#FFC01E',
          ink: '#101114',
          soft: '#FFE8A8',
        },
        border: {
          DEFAULT: '#E4E4E0',
          dark: '#2A2B30',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Archivo"', '"Familjen Grotesk"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '24px',
        'card-lg': '28px',
        'card-sm': '20px',
        pill: '9999px',
      },
      spacing: {
        section: '96px',
        'section-lg': '140px',
      },
      letterSpacing: {
        tightest: '-0.04em',
        tighter2: '-0.03em',
      },
      maxWidth: {
        page: '1440px',
      },
    },
  },
  plugins: [],
};
