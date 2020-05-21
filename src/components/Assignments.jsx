// @flow
import React, { useContext } from 'react';

import EmptyScreen from './EmptyScreen';
import AccountContext from '../contexts/AccountContext';
import noAssignments from '../images/no-assignments.png';

function Assignments() {
  const { activeAccount } = useContext(AccountContext);

  return (
    <EmptyScreen
      illustration={noAssignments}
      title="No assignments, yet!"
      description={
        activeAccount && activeAccount.isTeacher
          ? 'You haven\'t added any assignments yet. Add one using the big + button at the bottom right corner.'
          : 'Your assignments will appear here when your teachers add them. Stay tuned.'
      }
    />
  );
}

export default Assignments;
