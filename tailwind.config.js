/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./*.html",
    "./dashboard/*.html",
    "./js/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#78947A',
        secondary: '#C77D5B',
        accent: '#F3DFA2',
        // Neutrals use CSS variables so every utility (including /opacity variants)
        // automatically switches to a readable value when html.dark is present.
        bg: 'rgb(var(--lr-bg) / <alpha-value>)',
        surface: 'rgb(var(--lr-surface) / <alpha-value>)',
        heading: 'rgb(var(--lr-heading) / <alpha-value>)',
        body: 'rgb(var(--lr-body) / <alpha-value>)',
        border: 'rgb(var(--lr-border) / <alpha-value>)',
        dark: {
          bg: '#202B25',
          card: '#2B3830',
          surface: '#35443A',
          text: '#F8F4E9',
          muted: '#C6C9BC',
          accent: '#D69A78'
        }
      },
      fontFamily: {
        heading: ['"DM Serif Display"', 'serif'],
        body: ['"Nunito Sans"', 'sans-serif']
      },
      boxShadow: {
        soft: '0 10px 30px rgba(52,72,58,0.08)'
      },
      borderRadius: {
        xl2: '1.25rem'
      }
    },
  },
  plugins: [],
}
