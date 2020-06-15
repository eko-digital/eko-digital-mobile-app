// @flow
import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import { Alert, StyleSheet } from 'react-native';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-community/async-storage';
import { Button, Paragraph, useTheme } from 'react-native-paper';

import EmptyScreen from '../components/EmptyScreen';
import messageSent from '../images/message-sent.png';
import config from '../config';

const storageKey = 'confirmation-email-sent';

const styles = StyleSheet.create({
  email: {
    marginBottom: config.values.space.small,
  },

  paragraph: {
    textAlign: 'center',
    marginBottom: config.values.space.large,
  },
});

function VerifyEmail() {
  const [sendingEmail, setSendingEmail] = useState<boolean>(false);

  const authUser = useMemo(() => auth().currentUser, []);
  const theme = useTheme();

  const sendEmail = useCallback(async () => {
    setSendingEmail(true);

    try {
      await authUser.sendEmailVerification({
        url: config.emailVerificationContinueURL,
        android: {
          installApp: true,
          packageName: 'io.rkb.ekodigital',
        },
        iOS: {
          bundleId: 'io.rkb.ekodigital',
        },
      });
      await AsyncStorage.setItem(storageKey, 'true');
    } catch (error) {
      Alert.alert(
        'Oops!',
        'Something went wrong while sending confirmation email.',
        [
          { text: 'Retry', onPress: sendEmail, style: 'default' },
          { text: 'OK', style: 'cancel' },
        ],
      );

      if (__DEV__) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    }

    setSendingEmail(false);
  }, [authUser]);

  useEffect(() => {
    AsyncStorage.getItem(storageKey).then((emailSent) => {
      if (!authUser.emailVerified && !emailSent) {
        sendEmail();
      }
    });
  }, [authUser, authUser.emailVerified, sendEmail]);

  return (
    <EmptyScreen
      illustration={messageSent}
      title="Confirm your email address"
      description="We have sent a confirmation link to:"
      extra={(
        <>
          <Paragraph style={[styles.email, { ...theme.fonts.medium }]}>{authUser.email}</Paragraph>
          <Paragraph style={styles.paragraph}>
            Check your email and click on the confirmation link to continue.
          </Paragraph>
          <Button
            mode="text"
            onPress={sendEmail}
            loading={sendingEmail}
          >
            Resend email
          </Button>
        </>
      )}
    />
  );
}

export default VerifyEmail;
