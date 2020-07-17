// @flow
import React, { useContext } from 'react';
import color from 'color';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { useTheme } from 'react-native-paper';
import { Platform } from 'react-native';

import overlay from '../overlay';
import Home from './Home';
import Profile from './Profile';
import Bookmarks from './Bookmarks';
import AccountContext from '../contexts/AccountContext';
import Settings from './Settings';

const Tab = createMaterialBottomTabNavigator();

function BottomTabs() {
  const { activeAccount } = useContext(AccountContext);

  const theme = useTheme();

  const tabBarColor = theme.dark
    ? overlay(6, theme.colors.surface)
    : theme.colors.surface;

  const inactiveTabColor = React.useMemo(() => color(theme.colors.text)
    .alpha(0.6)
    .rgb()
    .string(),
  [theme.colors.text]);

  return (
    <>
      <Tab.Navigator
        initialRouteName="Home"
        backBehavior="initialRoute"
        activeColor={theme.colors.primary}
        inactiveColor={inactiveTabColor}
        theme={theme}
        // disable scene animation on android until following bug is fixed
        // https://github.com/facebook/react-native/issues/23090#issuecomment-642279615
        sceneAnimationEnabled={Platform.OS !== 'android'}
        barStyle={{ backgroundColor: tabBarColor }}
        shifting={false}
      >
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            tabBarIcon: 'book-open-outline',
            tabBarColor,
          }}
          navigationOptions={{
            headerTitle: activeAccount ? `Hello, ${activeAccount.name.split(' ')[0]}` : 'Home',
          }}
        />
        {!activeAccount?.isTeacher && (
          <Tab.Screen
            name="Bookmarks"
            component={Bookmarks}
            options={{
              tabBarIcon: 'bookmark-multiple-outline',
              tabBarColor,
            }}
          />
        )}
        <Tab.Screen
          name="Settings"
          component={Settings}
          options={{
            tabBarIcon: 'settings-outline',
            tabBarColor,
          }}
        />
        <Tab.Screen
          name="You"
          component={Profile}
          options={{
            tabBarIcon: 'account-circle-outline',
            tabBarColor,
          }}
        />
      </Tab.Navigator>
    </>
  );
}

export default BottomTabs;
