// @flow
import React, { useContext } from 'react';

import EmptyScreen from './EmptyScreen';
import AccountContext from '../contexts/AccountContext';
import discuss from '../images/discuss.png';

function Discuss() {
  const { activeAccount } = useContext(AccountContext);

  return (
    <EmptyScreen
      illustration={discuss}
      title="Start discussion"
      description={
        activeAccount && activeAccount.isTeacher
          ? 'Create a new topic to start discussion.'
          + ' Your students and fellow teachers can view and comment on your topic.'
          : 'Create a new topic to start discussion.'
            + ' Your classmates & teachers can view and comment on your topic.'
      }
    />
  );
}

export default Discuss;
