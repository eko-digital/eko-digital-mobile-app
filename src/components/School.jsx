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

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'center',
  },
  logoWrap: {
    padding: 8,
    marginVertical: 16,
    backgroundColor: DefaultTheme.colors.background,
  },
  description: {
    marginTop: 10,
    textAlign: 'center',
  },
  contactSection: {
    width: '100%',
    marginTop: 20,
  },
});

function School() {
  const { activeAccount: account } = useContext(AccountContext);
  const theme = useTheme();

  if (!account) {
    return null;
  }

  const { school } = account;

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
