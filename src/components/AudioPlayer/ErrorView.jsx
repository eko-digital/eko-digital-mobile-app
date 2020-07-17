// @flow
import React from 'react';
import { View, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from 'react-native-paper';
import BodyText from '../BodyText';
import config from '../../config';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: config.values.space.normal,
    alignItems: 'center',
  },
  errorMessage: {
    flex: 1, // to prevent text from overflowing padding box on Android
    marginLeft: config.values.space.normal,
    justifyContent: 'flex-start',
  },
});

function ErrorView() {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <MaterialCommunityIcons
        name="alert-circle-outline"
        color={theme.colors.notification}
        size={30}
      />
      <View style={styles.errorMessage}>
        <BodyText>Oops! Something went wrong while loading audio.</BodyText>
      </View>
    </View>
  );
}

export default ErrorView;
