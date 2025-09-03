import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './pages/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#1E3A8A', // navy blue
          light: '#3B82F6',
          accent: '#F59E0B', // amber
        },
      },
    },
  },
  plugins: [],
};

export default config;
