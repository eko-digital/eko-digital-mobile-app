/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {
  Provider as PaperProvider,
  Text,
  ActivityIndicator,
  Button,
  Avatar,
} from 'react-native-paper';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';

import RNFirebaseAuthUI from './RNFirebaseAuthUI';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>();

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((authUser) => {
      if (!authUser) {
        RNFirebaseAuthUI.launchSingInFlow();
      } else {
        RNFirebaseAuthUI.closeSingInFlow();
      }

      setUser(authUser);
      if (initializing) setInitializing(false);
    });
    return unsubscribe;
  });

  if (initializing) {
    return <ActivityIndicator animating />;
  }

  if (!user) {
    return null;
  }

  return (
    <NavigationContainer>
      <PaperProvider>
        <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
        <SafeAreaView style={styles.container}>
          <Avatar.Image size={64} source={{ uri: user.photoURL || '' }} />
          <Text>{`Welcome ${user.displayName}`}</Text>
          <Button mode="contained" onPress={() => auth().signOut()}>Sign Out</Button>
        </SafeAreaView>
      </PaperProvider>
    </NavigationContainer>
  );
}

export default App;
