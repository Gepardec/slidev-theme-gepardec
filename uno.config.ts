import { defineConfig } from 'unocss'

// Expose the Gepardec brand yellow (--gepardec-yellow, #FFC800) as a named
// UnoCSS color so it can be used like any built-in color scale, e.g.
// `bg-gepardec-500`, `text-gepardec-400`, `border-gepardec-500`,
// including opacity modifiers (`bg-gepardec-500 bg-opacity-10`).
// Static hex shades are required so UnoCSS can derive rgba() for opacity.
export default defineConfig({
  theme: {
    colors: {
      gepardec: {
        DEFAULT: '#FFC800',
        50:  '#FFF9E6',
        100: '#FFF0BF',
        200: '#FFE480',
        300: '#FFD84A',
        400: '#FFD01F',
        500: '#FFC800',
        600: '#E6B400',
        700: '#B88E00',
        800: '#8A6B00',
        900: '#5C4700',
      },
    },
  },
})
