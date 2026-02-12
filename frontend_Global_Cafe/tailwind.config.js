/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Colores personalizados para el tema de café
        coffee: {
          50: '#fdf8f3',
          100: '#f9efe3',
          200: '#f2dcc4',
          300: '#e9c39d',
          400: '#dea473',
          500: '#d4864d',
          600: '#c66d3d',
          700: '#a55534',
          800: '#854630',
          900: '#6c3b29',
          950: '#3a1d14',
        },
      },
    },
  },
  plugins: [],
}
