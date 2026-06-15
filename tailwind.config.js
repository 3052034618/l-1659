/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1rem",
    },
    extend: {
      colors: {
        primary: {
          50: "#F5F3FF",
          100: "#EDE9FE",
          200: "#DDD6FE",
          300: "#C4B5FD",
          400: "#A78BFA",
          500: "#1E293B",
          600: "#0F172A",
          700: "#020617",
          800: "#020617",
          900: "#020617",
        },
        gold: {
          50: "#FEF3C7",
          100: "#FDE68A",
          200: "#FCD34D",
          300: "#FBBF24",
          400: "#D4A574",
          500: "#D4A574",
          600: "#B8860B",
          700: "#92400E",
          800: "#78350F",
          900: "#451A03",
        },
        ink: {
          bg: "#0B1220",
          surface: "#111827",
          card: "#1E293B",
          border: "#334155",
        }
      },
      fontFamily: {
        serif: ['"Noto Serif SC"', '"Source Han Serif CN"', 'Georgia', 'serif'],
        sans: ['"Noto Sans SC"', '"PingFang SC"', '"Microsoft YaHei"', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 24px -4px rgba(0,0,0,0.3)',
        'gold': '0 0 20px rgba(212,165,116,0.15)',
      },
      backgroundImage: {
        'gradient-gold': 'linear-gradient(135deg, #D4A574 0%, #B8860B 100%)',
        'gradient-dark': 'linear-gradient(180deg, #0B1220 0%, #111827 100%)',
        'gradient-card': 'linear-gradient(145deg, rgba(30,41,59,0.6) 0%, rgba(15,23,42,0.8) 100%)',
      },
      keyframes: {
        pulseSlow: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      },
      animation: {
        'pulse-slow': 'pulseSlow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      spacing: {
        '128': '32rem',
      }
    },
  },
  plugins: [],
};
