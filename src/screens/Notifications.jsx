// @flow
import React from 'react';

import EmptyScreen from '../components/EmptyScreen';
import noMessages from '../images/no-messages.png';

function Notifications() {
  return (
    <EmptyScreen
      illustration={noMessages}
      title="Notifications"
      description="Stay notified about new updates."
    />
  );
}

export default Notifications;
