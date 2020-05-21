// @flow
import React, { useContext, useMemo, useCallback } from 'react';
import { Button, Paragraph } from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import { Linking } from 'react-native';

import emptyState from '../images/empty-state.png';
import AccountContext from '../contexts/AccountContext';
import EmptyScreen from './EmptyScreen';

const ekoDigitalHomeUrl = 'https://eko.digital';

function AccountNotFound() {
  const { accountsCache } = useContext(AccountContext);

  const handleLogout = React.useCallback(async () => {
    if (accountsCache) {
      await accountsCache.clear();
    }

    auth().signOut();
  }, [accountsCache]);

  const openEkoDigital = useCallback(() => {
    if (Linking.canOpenURL(ekoDigitalHomeUrl)) {
      Linking.openURL(ekoDigitalHomeUrl);
    }
  }, []);

  const emailOrMobileNumber = useMemo(() => {
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
        `We could not find any account linked to ${emailOrMobileNumber}`
          + ' in any of the school\'s database.'
          + '\n\nPlease login with the same email'
          + ' or phone number you received the invitation on.'
          + ' If this error persists, please contact your school.'
      }
      extra={(
        <>
          <Paragraph>If you are a school then sign up at</Paragraph>
          <Button
            mode="text"
            onClick={openEkoDigital}
            uppercase={false}
          >
            https://eko.digital
          </Button>
          <Button
            style={{ marginTop: 20 }}
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
