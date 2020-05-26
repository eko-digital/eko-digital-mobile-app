// @flow
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

function FullScreenActivityIndicator() {
  return (
    <View style={styles.container}>
      <ActivityIndicator />
    </View>
  );
}

export default FullScreenActivityIndicator;
