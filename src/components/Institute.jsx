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
import useInstitute from '../hooks/useInstitute';
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

function Institute() {
  const { activeAccount: account } = useContext(AccountContext);
  const theme = useTheme();

  const {
    loading,
    loadingError,
    institute,
    retry,
  } = useInstitute(account);

  if (loading) {
    return <FullScreenActivityIndicator />;
  }

  if (loadingError || !institute) {
    return (
      <ErrorScreen
        description="Oops! Something went wrong."
        onRetry={retry}
      />
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {institute.logo && (
        <View style={[styles.logoWrap, { borderRadius: theme.roundness }]}>
          <AutoHeightImage
            width={144}
            source={{ uri: institute.logo }}
          />
        </View>
      )}

      <Title>{institute.name}</Title>
      <Paragraph style={styles.description}>{institute.description}</Paragraph>

      {(institute.email || institute.phoneNumber) && (
        <List.Section style={styles.contactSection}>
          <List.Subheader>Contact Details</List.Subheader>
          {institute.email && (
            <List.Item
              title="Email"
              description={institute.email}
              // eslint-disable-next-line react/jsx-props-no-spreading
              left={(props) => <List.Icon {...props} icon="at" />}
            />
          )}
          {institute.phoneNumber && (
            <List.Item
              title="Phone number"
              description={institute.phoneNumber}
              // eslint-disable-next-line react/jsx-props-no-spreading
              left={(props) => <List.Icon {...props} icon="phone" />}
            />
          )}
        </List.Section>
      )}
    </ScrollView>
  );
}

export default Institute;
