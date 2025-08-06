/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx,html}",
    "./public/index.html"
  ],
  darkMode: 'media',
  plugins: [
    require('tailwindcss-animate')
  ]
}
