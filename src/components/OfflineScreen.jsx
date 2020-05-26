/* eslint-disable react/require-default-props */
// @flow
import React from 'react';
import { Button } from 'react-native-paper';

import illustration from '../images/no-connection.png';
import EmptyScreen from './EmptyScreen';

type Props = {
  title?: string,
  description?: string,
  onRetry?: () => any,
}

function OfflineScreen({
  title = 'You\'re Offline.',
  description = 'Looks like you are not connected to the internet.'
    + ' Please check your internet settings.',
  onRetry = null,
}: Props) {
  return (
    <EmptyScreen
      illustration={illustration}
      title={title}
      description={description}
      extra={onRetry && (
        <Button
          onPress={onRetry}
          mode="outlined"
          style={{ marginTop: 10 }}
        >
          Retry
        </Button>
      )}
    />
  );
}

export default OfflineScreen;
