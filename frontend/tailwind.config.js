/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        heading: ['"Space Grotesk"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        accent: {
          DEFAULT: '#6366f1',
          dark: '#4f46e5',
          glow: 'rgba(99,102,241,0.4)',
          subtle: 'rgba(99,102,241,0.1)',
        },
        glass: {
          DEFAULT: 'rgba(255,255,255,0.05)',
          border: 'rgba(255,255,255,0.1)',
          shadow: 'rgba(0,0,0,0.4)',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 1.8s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
        'blob': 'morphBlob 20s ease-in-out infinite alternate',
        'gradient': 'gradientShift 4s ease infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        morphBlob: {
          '0%':   { borderRadius: '40% 60% 60% 40% / 60% 30% 70% 40%', transform: 'translate(0,0) scale(1)' },
          '25%':  { borderRadius: '60% 40% 30% 70% / 40% 60% 40% 60%', transform: 'translate(30px,-20px) scale(1.05)' },
          '50%':  { borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%', transform: 'translate(-20px,20px) scale(0.95)' },
          '75%':  { borderRadius: '50% 40% 50% 60% / 35% 55% 45% 65%', transform: 'translate(15px,10px) scale(1.02)' },
          '100%': { borderRadius: '40% 60% 60% 40% / 60% 30% 70% 40%', transform: 'translate(0,0) scale(1)' },
        },
        gradientShift: {
          '0%':   { backgroundPosition: '0% 50%' },
          '50%':  { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(99,102,241,0.4)' },
          '50%':       { boxShadow: '0 0 30px rgba(99,102,241,0.7)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
