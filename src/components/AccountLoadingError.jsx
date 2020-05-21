// @flow
import React, { useContext } from 'react';
import { Button } from 'react-native-paper';

import noCollection from '../images/no-connection.png';
import EmptyScreen from './EmptyScreen';
import AccountContext from '../contexts/AccountContext';

function AccountLoadingError() {
  const { fetchAccounts, loading } = useContext(AccountContext);

  return (
    <EmptyScreen
      illustration={noCollection}
      title="Oops!"
      description={
        'Something went wrong while fetching your account details.'
        + ' Please make sure you are connected to the internet.'
      }
      extra={(
        <Button
          onPress={fetchAccounts}
          mode="outlined"
          style={{ marginTop: 10 }}
          loading={loading}
        >
          Retry
        </Button>
      )}
    />
  );
}

export default AccountLoadingError;
