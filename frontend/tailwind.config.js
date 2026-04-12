/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#f9ffe0', 100: '#f0ffa8', 200: '#e4f500', 300: '#d4f500',
          400: '#c8e800', 500: '#b8d400', 600: '#9ab800', 700: '#7a9200',
          800: '#5a6c00', 900: '#3a4600',
        },
        brand: {
          yellow: '#d4f500',
          black:  '#050500',
          white:  '#ffffff',
        },
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'Courier New', 'monospace'],
      },
      animation: {
        'fade-in':     'fadeIn 0.5s ease-in-out',
        'slide-up':    'slideUp 0.5s ease-out',
        'float':       'float 4s ease-in-out infinite',
        'glow':        'glowPulse 2.5s ease-in-out infinite',
        'gradient':    'gradientShift 4s ease infinite',
        'blur-in':     'blurIn 0.7s ease-out forwards',
        'text-shimmer':'textShimmer 3s linear infinite',
      },
      keyframes: {
        fadeIn:       { '0%': { opacity:'0' }, '100%': { opacity:'1' } },
        slideUp:      { '0%': { transform:'translateY(20px)', opacity:'0' }, '100%': { transform:'translateY(0)', opacity:'1' } },
        float:        { '0%,100%': { transform:'translateY(0)' }, '50%': { transform:'translateY(-12px)' } },
        glowPulse:    { '0%,100%': { boxShadow:'0 0 20px rgba(212,245,0,0.3)' }, '50%': { boxShadow:'0 0 40px rgba(212,245,0,0.6)' } },
        gradientShift:{ '0%': { backgroundPosition:'0% 50%' }, '50%': { backgroundPosition:'100% 50%' }, '100%': { backgroundPosition:'0% 50%' } },
        blurIn:       { from: { filter:'blur(12px)', opacity:'0' }, to: { filter:'blur(0)', opacity:'1' } },
        textShimmer:  { '0%': { backgroundPosition:'-200% center' }, '100%': { backgroundPosition:'200% center' } },
      },
      transitionTimingFunction: { 'spring': 'cubic-bezier(0.16, 1, 0.3, 1)' },
    },
  },
  plugins: [],
}
