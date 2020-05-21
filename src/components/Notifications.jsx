// @flow
import React from 'react';

import EmptyScreen from './EmptyScreen';
import noMessages from '../images/no-messages.png';

function Notifications() {
  return (
    <EmptyScreen
      illustration={noMessages}
      title="No notifications, yet!"
      description="When your school sends you notifications they will appear here."
    />
  );
}

export default Notifications;
