// @flow
import * as React from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { Provider as PaperProvider } from 'react-native-paper';
import { useColorScheme } from 'react-native';

import PreferencesContext from '../contexts/PreferencesContext';
import type { ColorScheme } from '../types';
import config from '../config';

type Props = {
  children: React.Node,
};

function PreferencesProvider({ children }: Props) {
  const [initializing, setInitializing] = React.useState<boolean>(true);
  const [theme, setTheme] = React.useState<ColorScheme>('system-default');
  const [notificationEnabled, setNotificationEnabled] = React.useState<boolean>(false);

  const systemColorScheme = useColorScheme();

  const paperTheme = React.useMemo(() => {
    if (theme === 'system-default') {
      return systemColorScheme === 'dark' ? config.themes.DarkTheme : config.themes.DefaultTheme;
    }
    return theme === 'dark' ? config.themes.DarkTheme : config.themes.DefaultTheme;
  }, [theme, systemColorScheme]);

  React.useEffect(() => {
    (async () => {
      const savedThemePreference = await AsyncStorage.getItem(config.themeKey);
      if (savedThemePreference) {
        setTheme(savedThemePreference);
      }

      const enabled: 'true' | 'false' | null = await AsyncStorage.getItem(config.systemNotificationEnabledKey);
      setNotificationEnabled(enabled === 'true');
      setInitializing(false);
    })();
  });

  const saveTheme = React.useCallback(async (newTheme: ColorScheme) => {
    await AsyncStorage.setItem(config.themeKey, newTheme);
    setTheme(newTheme);
  }, []);

  const toggleNotifications = React.useCallback(async () => {
    try {
      const newValue = notificationEnabled ? 'false' : 'true';
      await AsyncStorage.setItem(config.systemNotificationEnabledKey, newValue);
      setNotificationEnabled(!notificationEnabled);
    } catch (error) {
      console.error(error);
    }
  }, [notificationEnabled]);

  if (initializing) {
    return null;
  }

  const preferences = {
    theme,
    notificationEnabled,
    saveTheme,
    toggleNotifications,
  };

  return (
    <>
      <PreferencesContext.Provider value={preferences}>
        <PaperProvider theme={paperTheme}>
          {children}
        </PaperProvider>
      </PreferencesContext.Provider>
    </>
  );
}

export default PreferencesProvider;
