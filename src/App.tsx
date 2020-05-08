/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import 'react-native-gesture-handler';
import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider, Text } from 'react-native-paper';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

function App() {
  return (
    <NavigationContainer>
      <PaperProvider>
        <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
        <SafeAreaView style={styles.container}>
          <Text>Hello World!</Text>
        </SafeAreaView>
      </PaperProvider>
    </NavigationContainer>
  );
}

export default App;
