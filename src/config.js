// @flow
import { configureFonts, DefaultTheme, DarkTheme } from 'react-native-paper';

const fontConfig = {
  web: {
    regular: {
      fontFamily: 'Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif',
      fontWeight: '400',
    },
    medium: {
      fontFamily: 'Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif',
      fontWeight: '500',
    },
    light: {
      fontFamily: 'Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif',
      fontWeight: '300',
    },
    thin: {
      fontFamily: 'Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif',
      fontWeight: '100',
    },
  },
  ios: {
    regular: {
      fontFamily: 'System',
      fontWeight: '400',
    },
    medium: {
      fontFamily: 'System',
      fontWeight: '500',
    },
    light: {
      fontFamily: 'System',
      fontWeight: '300',
    },
    thin: {
      fontFamily: 'System',
      fontWeight: '100',
    },
  },
  default: {
    regular: {
      fontFamily: 'sans-serif',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'HKGrotesk-Bold',
      fontWeight: 'normal',
    },
    light: {
      fontFamily: 'sans-serif-light',
      fontWeight: 'normal',
    },
    thin: {
      fontFamily: 'sans-serif-thin',
      fontWeight: 'normal',
    },
  },
};

const config = {
  systemNotificationEnabledKey: 'system-notification-enabled',
  themeKey: 'theme',
  emailVerificationContinueURL: 'https://app.eko.digital/u9DC',
  themes: {
    DefaultTheme: {
      ...DefaultTheme,
      colors: {
        ...DefaultTheme.colors,
        primary: '#0097a7',
        accent: '#72DEFF',
        text: '#144356',
      },
      fonts: configureFonts(fontConfig),
    },
    DarkTheme: {
      ...DarkTheme,
      colors: {
        ...DarkTheme.colors,
        primary: '#0097a7',
        accent: '#72DEFF',
      },
      fonts: configureFonts(fontConfig),
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
