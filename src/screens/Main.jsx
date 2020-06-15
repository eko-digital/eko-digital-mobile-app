// @flow
import React, { useContext } from 'react';

import RootNavigator from '../components/RootNavigator';
import InstituteProvider from '../components/InstituteProvider';
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
