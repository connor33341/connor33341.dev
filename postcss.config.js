import tailwindcss from '@tailwindcss/postcss'
import autoprefixer from 'autoprefixer'

export default {
  parser: 'postcss-scss',
  plugins: [
    tailwindcss,
    autoprefixer,
  ],
}
