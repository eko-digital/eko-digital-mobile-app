// @flow
import React, { useContext } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import {
  Title,
  Paragraph,
  List,
  useTheme,
} from 'react-native-paper';
import AutoHeightImage from 'react-native-auto-height-image';
import { DefaultTheme } from '@react-navigation/native';

import AccountContext from '../contexts/AccountContext';
import useSchool from '../hooks/useSchool';
import FullScreenActivityIndicator from './FullScreenActivityIndicator';
import ErrorScreen from './ErrorScreen';
import config from '../config';

const styles = StyleSheet.create({
  container: {
    padding: config.values.space.normal,
    alignItems: 'center',
  },
  logoWrap: {
    padding: config.values.space.small,
    marginVertical: config.values.space.normal,
    backgroundColor: DefaultTheme.colors.background,
  },
  description: {
    marginTop: 10,
    textAlign: 'center',
  },
  contactSection: {
    width: '100%',
    marginTop: config.values.space.large,
  },
});

function School() {
  const { activeAccount: account } = useContext(AccountContext);
  const theme = useTheme();

  const {
    loading,
    loadingError,
    school,
    retry,
  } = useSchool(account);

  if (loading) {
    return <FullScreenActivityIndicator />;
  }

  if (loadingError || !school) {
    return (
      <ErrorScreen
        description="Something went wrong while loading school data."
        onRetry={retry}
      />
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {school.logo && (
        <View style={[styles.logoWrap, { borderRadius: theme.roundness }]}>
          <AutoHeightImage
            width={144}
            source={{ uri: school.logo }}
          />
        </View>
      )}

      <Title>{school.name}</Title>
      <Paragraph style={styles.description}>{school.description}</Paragraph>

      {(school.email || school.phoneNumber) && (
        <List.Section style={styles.contactSection}>
          <List.Subheader>Contact Details</List.Subheader>
          {school.email && (
            <List.Item
              title="Email"
              description={school.email}
              // eslint-disable-next-line react/jsx-props-no-spreading
              left={(props) => <List.Icon {...props} icon="at" />}
            />
          )}
          {school.phoneNumber && (
            <List.Item
              title="Phone number"
              description={school.phoneNumber}
              // eslint-disable-next-line react/jsx-props-no-spreading
              left={(props) => <List.Icon {...props} icon="phone" />}
            />
          )}
        </List.Section>
      )}
    </ScrollView>
  );
}

export default School;
