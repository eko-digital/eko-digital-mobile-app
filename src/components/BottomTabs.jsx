// @flow
import React, { useContext } from 'react';
import color from 'color';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { useTheme, Portal, FAB } from 'react-native-paper';
import { useSafeArea } from 'react-native-safe-area-context';
import { useIsFocused, RouteProp } from '@react-navigation/native';

import overlay from '../overlay';
import Lessons from './Lessons';
import Assignments from './Assignments';
import Discuss from './Discuss';
import Notifications from './Notifications';
import AccountContext from '../contexts/AccountContext';

const Tab = createMaterialBottomTabNavigator();

const routesWithFab = ['Lessons', 'Assignments'];

type Props = {
  route: RouteProp<any, 'LessonsList'>;
};

function BottomTabs({ route }: Props) {
  const { account } = useContext(AccountContext);
  const routeName = route.state
    ? route.state.routes[route.state.index].name
    : 'Lessons';

  const theme = useTheme();
  const safeArea = useSafeArea();
  const isFocused = useIsFocused();

  const fabVisible = isFocused && account
    && account.isTeacher && routesWithFab.includes(routeName);

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
        initialRouteName="Lessons"
        backBehavior="initialRoute"
        activeColor={theme.colors.primary}
        inactiveColor={inactiveTabColor}
      >
        <Tab.Screen
          name="Lessons"
          component={Lessons}
          options={{
            tabBarIcon: 'teach',
            tabBarColor,
          }}
        />
        <Tab.Screen
          name="Assignments"
          component={Assignments}
          options={{
            tabBarIcon: 'clipboard-text-outline',
            tabBarColor,
          }}
        />
        <Tab.Screen
          name="Discuss"
          component={Discuss}
          options={{
            tabBarIcon: 'forum-outline',
            tabBarColor,
          }}
        />
        <Tab.Screen
          name="Notifications"
          component={Notifications}
          options={{
            tabBarIcon: 'bell-outline',
            tabBarColor,
          }}
        />
      </Tab.Navigator>
      <Portal>
        <FAB
          visible={fabVisible}
          icon="plus"
          style={{
            position: 'absolute',
            bottom: safeArea.bottom + 65,
            right: 16,
          }}
          color="white"
          theme={{
            colors: {
              accent: theme.colors.primary,
            },
          }}
          onPress={() => { }}
        />
      </Portal>
    </>
  );
}

export default BottomTabs;
