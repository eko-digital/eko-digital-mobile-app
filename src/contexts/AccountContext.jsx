// @flow
import React from 'react';
import {
  DrawerContentComponentProps,
  DrawerNavigationProp,
} from '@react-navigation/drawer';

import type { Account } from '../types';

type Props = {
  account: Account | null,
  switchAccount: (navigation: DrawerContentComponentProps<DrawerNavigationProp>) => void,
}

const AccountContext = React.createContext<Props>({
  account: null,
  switchAccount: () => {},
});

export default AccountContext;
