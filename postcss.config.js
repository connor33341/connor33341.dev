import tailwindcss from '@tailwindcss/postcss'
import autoprefixer from 'autoprefixer'
import postcssScss from 'postcss-scss'

export default {
  parser: postcssScss,
  syntax: postcssScss,
  plugins: [
    tailwindcss,
    autoprefixer,
  ],
}
