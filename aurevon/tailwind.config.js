/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      height: {
        'screen-dvh': '100dvh',
      },
      minHeight: {
        'screen-dvh': '100dvh',
      },
      fontSize: {
        'fluid-hero': 'clamp(2.25rem, 8vw, 4.75rem)',
      },
    },
  },
  plugins: [],
}
