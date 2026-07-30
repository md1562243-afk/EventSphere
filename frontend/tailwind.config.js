/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#D87DE5',
        primaryHover: '#C95BE3',
        secondary: '#5F83C5',
        accent: '#F06AEF',
        bgapp: '#F0EAF7',
        surface: '#FFFFFF',
        sidebar: '#F4F3FF',
        searchbg: '#F7F7F7',
        heading: '#2A2A2A',
        body: '#6B6B6B',
        muted: '#9B9B9B',
        borderc: '#ECECEC',
        divider: '#E9E9E9',
        price: '#E965D9',
        badgebg: '#F4E6FA',
        badgetext: '#C65FD7',
        iconc: '#707070',
        success: '#22C55E',
        pendingc: '#F59E0B',
        errorc: '#EF4444'
      },
      fontFamily: {
        sans: ['Poppins', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      borderRadius: {
        card: '20px',
        btn: '14px',
        input: '12px',
        img: '18px'
      },
      boxShadow: {
        soft: '0 8px 24px rgba(0,0,0,.06)',
        glow: '0 0 0 1px #D87DE5, 0 8px 24px -8px rgba(216,125,229,.35)'
      },
      backgroundImage: {
        hero: 'linear-gradient(180deg, #FFFFFF 0%, #F4F0FC 55%, #F0EAF7 100%)'
      },
      transitionDuration: {
        250: '250ms'
      }
    }
  },
  plugins: []
};