// @flow
import React from 'react';

type PreferencesContextType = {
  theme: 'light' | 'dark',
  toggleTheme: () => void,
};

const PreferencesContext = React.createContext<PreferencesContextType>({
  theme: 'light',
  toggleTheme: () => { },
});

export default PreferencesContext;
