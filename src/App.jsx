/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import 'react-native-gesture-handler'; // keep it here for react-navigation to work
import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppearanceProvider, useColorScheme } from 'react-native-appearance';
import { Provider as PaperProvider } from 'react-native-paper';
import dynamicLinks from '@react-native-firebase/dynamic-links';

import RNFirebaseAuthUI from './RNFirebaseAuthUI';
import Main from './components/Main';
import PreferencesContext from './contexts/PreferencesContext';
import config from './config';

function App() {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>();

  const colorScheme = useColorScheme();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const loadSavedThemePreference = useCallback(async () => {
    setTheme(colorScheme === 'dark' ? 'dark' : 'light');
  }, [colorScheme]);

  const handleDynamicLink = useCallback(async (link: { url: string } | null) => {
    const { currentUser } = auth();
    if (link && link.url === config.emailVerificationContinueURL && currentUser) {
      await currentUser.reload();
      setUser(auth().currentUser);
    }
  }, []);

  useEffect(() => {
    loadSavedThemePreference();
    // dynamic links
    dynamicLinks().getInitialLink().then(handleDynamicLink);
    const unsubscribe = dynamicLinks().onLink(handleDynamicLink);
    return () => unsubscribe;
  }, [handleDynamicLink, loadSavedThemePreference]);

  const toggleTheme = useCallback(() => {
    setTheme((activeTheme) => (activeTheme === 'light' ? 'dark' : 'light'));
  }, []);

  const preferences = useMemo(() => ({
    toggleTheme,
    theme,
  }), [theme, toggleTheme]);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((authUser) => {
      if (!authUser) {
        RNFirebaseAuthUI.launchSingInFlow();
      } else {
        RNFirebaseAuthUI.closeSingInFlow();
      }

      setUser(authUser);
    });
    return unsubscribe;
  }, []);

  if (!user) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <AppearanceProvider>
        <PreferencesContext.Provider value={preferences}>
          <PaperProvider
            theme={theme === 'light' ? config.themes.DefaultTheme : config.themes.DarkTheme}
          >
            <Main />
          </PaperProvider>
        </PreferencesContext.Provider>
      </AppearanceProvider>
    </SafeAreaProvider>
  );
}

export default App;
