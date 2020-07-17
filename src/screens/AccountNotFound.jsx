// @flow
import React, { useMemo, useCallback } from 'react';
import { Button } from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import { Linking, StyleSheet } from 'react-native';

import emptyState from '../images/empty-state.png';
import EmptyScreen from '../components/EmptyScreen';
import BodyText from '../components/BodyText';
import config from '../config';

const ekoDigitalHomeUrl = 'https://eko.digital';

const styles = StyleSheet.create({
  button: {
    marginTop: config.values.space.large,
  },
  paragraph: {
    textAlign: 'center',
  },
});

function AccountNotFound() {
  const handleLogout = React.useCallback(async () => {
    auth().signOut();
  }, []);

  const openEkoDigital = useCallback(() => {
    if (Linking.canOpenURL(ekoDigitalHomeUrl)) {
      Linking.openURL(ekoDigitalHomeUrl);
    }
  }, []);

  const emailOrPhoneNumber = useMemo(() => {
    const { currentUser } = auth();

    if (currentUser) {
      return currentUser.phoneNumber || currentUser.email;
    }

    return 'this email id or phone number';
  }, []);

  return (
    <EmptyScreen
      illustration={emptyState}
      title="No account found!"
      description={
        `We could not find any account linked to ${emailOrPhoneNumber}`
          + ' in any of the educational institution\'s database.'
          + '\n\nPlease login with the same email'
          + ' or phone number you received the invitation on.'
          + ' If this error persists, please contact your school/college/institute.'
      }
      extra={(
        <>
          <BodyText style={styles.paragraph}>
            If you are a school, college or institute then sign up at
          </BodyText>
          <Button
            mode="text"
            onClick={openEkoDigital}
            uppercase={false}
          >
            https://eko.digital
          </Button>
          <Button
            style={styles.button}
            mode="outlined"
            onPress={handleLogout}
          >
            Log out
          </Button>
        </>
      )}
    />
  );
}

export default AccountNotFound;
