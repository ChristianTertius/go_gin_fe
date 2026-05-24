/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: '#0f172a',
        panel: '#111827',
        accent: '#38bdf8',
        accentSoft: '#0ea5e9',
        ink: '#0b1220',
        muted: '#94a3b8',
        border: '#1f2937',
      },
      fontFamily: {
        sans: ['Manrope', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Manrope', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        glass: '0 10px 50px rgba(0,0,0,0.35)',
      },
    },
  },
  plugins: [],
}
