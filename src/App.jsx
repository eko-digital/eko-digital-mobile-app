/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  SafeAreaView,
  Text,
  StatusBar,
  StyleSheet,
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    paddingTop: StatusBar.currentHeight,
  },
});

const App: () => React$Node = () => (
  <>
    <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
    <SafeAreaView style={styles.container}>
      <Text>Hello World!</Text>
    </SafeAreaView>
  </>
);

export default App;
