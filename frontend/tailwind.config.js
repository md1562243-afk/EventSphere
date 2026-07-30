/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#D4AF37',
        secondary: '#D4AF37',
        accent: '#F5C542',
        bgapp: '#0A0A0A',
        surface: '#171717',
        heading: '#FFFFFF',
        body: '#B8B8B8',
        borderc: 'rgba(212,175,55,0.20)',
        success: '#22C55E',
        pendingc: '#F59E0B',
        errorc: '#EF4444'
      },
      fontFamily: {
        sans: ['Poppins', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      borderRadius: {
        card: '18px',
        btn: '14px',
        input: '12px',
        img: '18px'
      },
      boxShadow: {
        soft: '0 12px 30px rgba(212,175,55,.10)',
        glow: '0 0 0 1px #D4AF37, 0 8px 32px -8px rgba(212,175,55,.35)'
      },
      backgroundImage: {
        hero: 'linear-gradient(180deg, #0A0A0A 0%, #121212 55%, #171717 100%)'
      },
      transitionDuration: {
        250: '250ms'
      }
    }
  },
  plugins: []
};