// @flow
import React from 'react';
import {
  DrawerContentComponentProps,
  DrawerNavigationProp,
} from '@react-navigation/drawer';

import type { Account } from '../types';

type Props = {|
  loading: boolean,
  loadingError: boolean,
  isOffline: boolean,
  activeAccount: Account | null,
  switchAccount: (navigation: DrawerContentComponentProps<DrawerNavigationProp>) => void,
|}

const AccountContext = React.createContext<Props>({
  loading: false,
  loadingError: false,
  isOffline: false,
  activeAccount: null,
  switchAccount: () => { },
});

export default AccountContext;
