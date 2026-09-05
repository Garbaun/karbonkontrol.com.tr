/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#10B981',
          600: '#059669',
          700: '#0F5132',
          800: '#08331F',
          900: '#052114',
        },
        cream: {
          50: '#FAFBF9',
          100: '#F3F6F4',
          200: '#E8EFEA',
        },
      },
      boxShadow: {
        'soft': '0 1px 2px 0 rgba(15, 81, 50, 0.04), 0 1px 3px 0 rgba(15, 81, 50, 0.04)',
        'card': '0 4px 6px -1px rgba(15, 23, 42, 0.04), 0 2px 4px -2px rgba(15, 23, 42, 0.04)',
        'card-hover': '0 20px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.08)',
        'emerald-glow': '0 10px 30px -10px rgba(16, 185, 129, 0.5)',
      },
      backgroundImage: {
        'grid-pattern': "linear-gradient(to right, rgba(15,81,50,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(15,81,50,0.04) 1px, transparent 1px)",
        'hero-gradient': 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(16,185,129,0.12), transparent)',
        'cta-gradient': 'linear-gradient(135deg, #0F5132 0%, #059669 50%, #10B981 100%)',
      },
      animation: {
        'marquee': 'marquee 30s linear infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
      },
    },
  },
  plugins: [],
}
