// @flow
import React, { useContext, useMemo } from 'react';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { useTheme } from 'react-native-paper';
import { StatusBar } from 'react-native';

import StackNavigator from './StackNavigator';
import InstituteProvider from '../components/InstituteProvider';
import AccountContext from '../contexts/AccountContext';
import AccountNotFound from './AccountNotFound';

function Main() {
  const { activeAccount } = useContext(AccountContext);
  const theme = useTheme();
  const navigationTheme = theme.dark ? DarkTheme : DefaultTheme;

  const instituteId = useMemo(() => activeAccount?.institute, [activeAccount]);

  const statusBar = useMemo(() => (
    <StatusBar
      barStyle={theme.dark ? 'light-content' : 'dark-content'}
      backgroundColor={theme.colors.surface}
    />
  ), [theme.colors.surface, theme.dark]);

  if (!instituteId) {
    return (
      <>
        <AccountNotFound />
        {statusBar}
      </>
    );
  }

  return (
    <InstituteProvider instituteId={instituteId}>
      <NavigationContainer theme={navigationTheme}>
        {statusBar}
        <StackNavigator />
      </NavigationContainer>
    </InstituteProvider>
  );
}

export default Main;
