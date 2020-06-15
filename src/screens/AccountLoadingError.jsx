// @flow
import React from 'react';

import noCollection from '../images/no-connection.png';
import EmptyScreen from '../components/EmptyScreen';

function AccountLoadingError() {
  return (
    <EmptyScreen
      illustration={noCollection}
      title="Oops!"
      description={
        'Something went wrong while fetching your account details.'
        + ' Please make sure you are connected to the internet.'
      }
    />
  );
}

export default AccountLoadingError;
