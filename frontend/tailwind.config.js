/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#6C63FF',
        secondary: '#00C2FF',
        accent: '#FFC857',
        bgapp: '#F8FAFC',
        surface: '#FFFFFF',
        heading: '#1E293B',
        body: '#475569',
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
        soft: '0 12px 30px rgba(0,0,0,.08)'
      },
      backgroundImage: {
        hero: 'linear-gradient(180deg, #FFFFFF 0%, #EEF2FF 55%, #DBEAFE 100%)'
      },
      transitionDuration: {
        250: '250ms'
      }
    }
  },
  plugins: []
};
