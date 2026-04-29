/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f7ff',
          100: '#eef1ff',
          200: '#e0e7ff',
          300: '#c7d2fe',
          400: '#a5b4fc',
          500: '#818cf8',
          600: '#667eea',
          700: '#5a67d8',
          800: '#4c51bf',
          900: '#434190',
        },
        secondary: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
        },
        accent: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        // 主题颜色配置
        light: {
          bg: '#f5f7fa',
          card: '#ffffff',
          text: '#2d3748',
        },
        dark: {
          bg: '#1a1a2e',
          card: '#16213e',
          text: '#e2e8f0',
        },
        forest: {
          bg: '#f0f7f4',
          card: '#ffffff',
          text: '#2d3748',
        },
        ocean: {
          bg: '#ebf8ff',
          card: '#ffffff',
          text: '#2d3748',
        },
        starry: {
          bg: '#1a202c',
          card: '#2d3748',
          text: '#f7fafc',
        },
        sunset: {
          bg: '#fffaf0',
          card: '#ffffff',
          text: '#2d3748',
        },
        dream: {
          bg: '#faf5ff',
          card: '#ffffff',
          text: '#2d3748',
        },
        minimal: {
          bg: '#f8fafc',
          card: '#ffffff',
          text: '#1e293b',
        },
        vintage: {
          bg: '#f5f1e6',
          card: '#ffffff',
          text: '#4a4a4a',
        },
        custom: {
          bg: '#f5f7fa',
          card: '#ffffff',
          text: '#2d3748',
        }
      },
      fontFamily: {
        sans: ['"Microsoft YaHei"', '"PingFang SC"', '"Helvetica Neue"', 'Arial', 'sans-serif'],
      },
      animation: {
        'shake': 'shake 0.5s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'scale-in': 'scaleIn 0.5s ease-out forwards',
        'glow': 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-10deg)' },
          '75%': { transform: 'rotate(10deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        fadeIn: {
          'from': { opacity: '0', transform: 'translateY(20px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          'from': { opacity: '0', transform: 'scale(0.8)' },
          'to': { opacity: '1', transform: 'scale(1)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(102, 126, 234, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(102, 126, 234, 0.6)' },
        }
      },
      boxShadow: {
        'card': '0 10px 40px rgba(102, 126, 234, 0.15)',
        'card-dark': '0 10px 40px rgba(0, 0, 0, 0.3)',
        'btn': '0 4px 15px rgba(102, 126, 234, 0.4)',
      }
    },
  },
  plugins: [],
}
