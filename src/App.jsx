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
} from 'react';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import { activateKeepAwake } from 'expo-keep-awake';

import config from './config';
import Main from './screens/Main';
import RNFirebaseAuthUI from './RNFirebaseAuthUI';
import AccountProvider from './components/AccountProvider';
import PreferencesProvider from './components/PreferencesProvider';

function App() {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>();

  const handleDynamicLink = useCallback(async (link: { url: string } | null) => {
    const { currentUser } = auth();
    if (link && link.url === config.emailVerificationContinueURL && currentUser) {
      await currentUser.reload();
      setUser(auth().currentUser);
    }
  }, []);

  useEffect(() => {
    dynamicLinks().getInitialLink().then(handleDynamicLink);
    const unsubscribe = dynamicLinks().onLink(handleDynamicLink);
    return () => unsubscribe;
  }, [handleDynamicLink]);

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

  if (__DEV__) {
    activateKeepAwake();
  }

  if (!user) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <PreferencesProvider>
        <AccountProvider>
          <Main />
        </AccountProvider>
      </PreferencesProvider>
    </SafeAreaProvider>
  );
}

export default App;
