// @flow
import React from 'react';
import { Button } from 'react-native-paper';

import illustration from '../images/empty-state.png';
import EmptyScreen from './EmptyScreen';

type Props = {
  title?: string,
  description?: string,
  onRetry?: () => any,
}

function ErrorScreen({
  title = 'Oops!',
  description = 'Something went wrong.',
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

export default ErrorScreen;
