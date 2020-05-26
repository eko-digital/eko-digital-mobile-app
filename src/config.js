// @flow
import { DefaultTheme, DarkTheme } from 'react-native-paper';

const config = {
  themes: {
    DefaultTheme: {
      ...DefaultTheme,
      colors: {
        ...DefaultTheme.colors,
        primary: '#1EB980',
        accent: '#72DEFF',
      },
    },
    DarkTheme: {
      ...DarkTheme,
      colors: {
        ...DarkTheme.colors,
        primary: '#1EB980',
        accent: '#72DEFF',
      },
    },
  },
  values: {
    space: {
      extraSmall: 4,
      small: 8,
      normal: 16,
      large: 20,
    },
  },
};

export default config;
