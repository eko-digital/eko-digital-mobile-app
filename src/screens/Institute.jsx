// @flow
import React, { useContext, useCallback } from 'react';
import {
  ScrollView, StyleSheet, View, Linking,
} from 'react-native';
import {
  Title,
  List,
  useTheme,
} from 'react-native-paper';
import AutoHeightImage from 'react-native-auto-height-image';
import { DefaultTheme } from '@react-navigation/native';

import config from '../config';
import InstituteContext from '../contexts/InstituteContext';
import BodyText from '../components/BodyText';

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
  const theme = useTheme();

  const { institute } = useContext(InstituteContext);

  const handleEmailPress = useCallback(() => {
    if (!institute) {
      return;
    }

    try {
      Linking.openURL(`mailto:${institute.email}`);
    } catch (error) {
      console.error(error);
    }
  }, [institute]);

  const handlePhoneNumberPress = useCallback(() => {
    if (!institute || !institute.phoneNumber) {
      return;
    }

    try {
      Linking.openURL(`tel:${institute.phoneNumber}`);
    } catch (error) {
      console.error(error);
    }
  }, [institute]);

  if (!institute) {
    return null;
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
      {institute.description && (
        <BodyText style={styles.description}>{institute.description}</BodyText>
      )}

      {(institute.email || institute.phoneNumber) && (
        <List.Section style={styles.contactSection}>
          <List.Subheader>Contact Details</List.Subheader>
          {institute.email && (
            <List.Item
              title="Email"
              description={institute.email}
              // eslint-disable-next-line react/jsx-props-no-spreading
              left={(props) => <List.Icon {...props} icon="at" />}
              onPress={handleEmailPress}
            />
          )}
          {institute.phoneNumber && (
            <List.Item
              title="Phone number"
              description={institute.phoneNumber}
              // eslint-disable-next-line react/jsx-props-no-spreading
              left={(props) => <List.Icon {...props} icon="phone" />}
              onPress={handlePhoneNumberPress}
            />
          )}
        </List.Section>
      )}
    </ScrollView>
  );
}

export default Institute;
