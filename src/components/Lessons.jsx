// @flow
import React, { useContext } from 'react';

import EmptyScreen from './EmptyScreen';
import AccountContext from '../contexts/AccountContext';
import noLessons from '../images/no-lessons.png';

function Lessons() {
  const { activeAccount } = useContext(AccountContext);

  return (
    <EmptyScreen
      illustration={noLessons}
      title="No lessons, yet!"
      description={
        activeAccount && activeAccount.isTeacher
          ? 'You haven\'t added any lessons yet. Add one using the big + button at the bottom right corner.'
          : 'Your lessons will appear here when your teachers add them. Stay tuned.'
      }
    />
  );
}

export default Lessons;
