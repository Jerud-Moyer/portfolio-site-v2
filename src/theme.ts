import { definePreset } from '@primeuix/themes'
import Material from '@primeuix/themes/material'
// import Aura from '@primeuix/themes/aura'
// THIS THEME IS FOR PRIMEVUE COMPONENTS
export default definePreset(Material, {
  semantic: {
    colorScheme: {
      dark: {
        primary: {
          50: '#81B196',
          100: '#74AA8B',
          200: '#67A281',
          300: '#5D9877',
          400: '#558B6E',
          500: '#4E7E64',
          600: '#46725A',
          700: '#3E6550',
          800: '#365946',
          900: '#365946',
          950: '#365946',
        },
        secondary: {
          300: '#E7E7C5',
          400: '#E1E1B7',
          500: '#7C7C79',
          600: '#71716F',
        },
        surface: {
          0: '#ffffff',
          50: '#F9F9F1',
          100: '#F3F3E2',
          200: '#EDEDD4',
          300: '#E7E7C5',
          400: '#E1E1B7',
          500: '#7C7C79',
          600: '#71716F',
          700: '#676765',
          800: '#5D5D5B',
          900: '#525251',
          950: '#3C3C3B',
        },
      },
    },
    focusRing: {
      width: '2px',
      style: 'solid',
      color: '{primary.color}',
      offset: '1px',
    },
  },

  components: {
    toolbar: {
      colorScheme: {
        dark: {
          root: {},
        },
      },
    },
    button: {
      colorScheme: {
        dark: {
          outlined: {
            primary: {
              color: '{sky.400}',
              hoverBackground: '{pink.600}',
              borderColor: '#a3bda8',
            },
            secondary: {
              color: '#b7c7cd',
              borderColor: '#a3bda8',
            },
          },
        },
      },
      // outlined: {
      //   primary: {
      //     color: '{sky.400}', // why wont this work?
      //     hoverBackground: '{pink-600}',
      //     borderColor: '#a3bda8',
      //   },
      //   secondary: {
      //     color: '{sky.400}', // why wont this work?
      //     hoverBackground: '{pink.600}',
      //     borderColor: '#ffffff',
      //   },
      // },
    },
    inputtext: {
      root: {
        background: '#3c3c3b',
        borderColor: '#a3bda8',
        focusBorderColor: '#dacaaa',
      },
    },
    textarea: {
      root: {
        background: '#3c3c3b',
        borderColor: '#a3bda8',
        focusBorderColor: '#dacaaa',
      },
    },
    floatlabel: {
      root: {
        color: '#b07156',
        focusColor: '#dacaaa',
      },
      on: {
        active: {
          background: '#3c3c3b',
        },
      },
    },
  },
})
