/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx,html}",
    "./public/index.html"
  ],
  darkMode: 'class',
  plugins: [
    require('tailwindcss-animate')
  ]
}
