// @flow
import React from 'react';

import noCollection from '../images/no-connection.png';
import EmptyScreen from '../components/EmptyScreen';

function InstituteLoadingError() {
  return (
    <EmptyScreen
      illustration={noCollection}
      title="Oops!"
      description={
        'Something went wrong.'
        + ' Please make sure you are connected to the internet.'
      }
    />
  );
}

export default InstituteLoadingError;
