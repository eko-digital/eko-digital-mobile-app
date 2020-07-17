// @flow
import React from 'react';

import type { ColorScheme } from '../types';

type PreferencesContextType = {|
  theme: ColorScheme,
  notificationEnabled: boolean,
  saveTheme: (theme: ColorScheme) => void | Promise<void>,
  toggleNotifications: () => void | Promise<void>,
|};

const PreferencesContext = React.createContext<PreferencesContextType>({
  theme: 'light',
  notificationEnabled: false,
  saveTheme: () => { },
  toggleNotifications: () => { },
});

export default PreferencesContext;
