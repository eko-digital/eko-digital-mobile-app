// @flow
import React, { useContext } from 'react';

import RootNavigator from './RootNavigator';
import InstituteProvider from './InstituteProvider';
import AccountContext from '../contexts/AccountContext';

function Main() {
  const { activeAccount } = useContext(AccountContext);

  return (
    <InstituteProvider instituteId={activeAccount?.institute}>
      <RootNavigator />
    </InstituteProvider>
  );
}

export default Main;
