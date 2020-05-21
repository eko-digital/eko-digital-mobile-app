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
};

export default config;
