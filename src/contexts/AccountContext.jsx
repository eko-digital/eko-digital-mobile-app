// @flow
import React from 'react';
import {
  DrawerContentComponentProps,
  DrawerNavigationProp,
} from '@react-navigation/drawer';

import type { Account } from '../types';
import AccountsCache from '../helpers/AccountsCache';

type Props = {
  loading: boolean,
  loadingError: boolean,
  activeAccount: Account | null,
  accountsCache: AccountsCache | null,
  switchAccount: (navigation: DrawerContentComponentProps<DrawerNavigationProp>) => void,
  fetchAccounts: () => any,
}

const AccountContext = React.createContext<Props>({
  loading: false,
  activeAccount: null,
  loadingError: false,
  accountsCache: null,
  switchAccount: () => { },
  fetchAccounts: () => { },
});

export default AccountContext;
