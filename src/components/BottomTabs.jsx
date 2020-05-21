// @flow
import React, { useContext } from 'react';
import color from 'color';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { useTheme, Portal } from 'react-native-paper';
import { useIsFocused, RouteProp, useNavigation } from '@react-navigation/native';

import overlay from '../overlay';
import Lessons from './Lessons';
import Assignments from './Assignments';
import Discuss from './Discuss';
import Notifications from './Notifications';
import AccountContext from '../contexts/AccountContext';
import AddLessonFABGroup from './AddLessonFABGroup';
import AddAssignmentFABGroup from './AddAssignmentFABGroup';
import AddTopicFab from './AddTopicFab';

const Tab = createMaterialBottomTabNavigator();

type Props = {
  route: RouteProp<any, 'LessonsList'>;
};

function BottomTabs({ route }: Props) {
  const { activeAccount } = useContext(AccountContext);
  const { navigate } = useNavigation();
  const routeName = route.state
    ? route.state.routes[route.state.index].name
    : 'Lessons';

  const theme = useTheme();
  const isFocused = useIsFocused();

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
        {isFocused && activeAccount && activeAccount.isTeacher && routeName === 'Lessons' && (
          <AddLessonFABGroup navigate={navigate} />
        )}
        {isFocused && activeAccount && activeAccount.isTeacher && routeName === 'Assignments' && (
          <AddAssignmentFABGroup navigate={navigate} />
        )}
        {isFocused && activeAccount && routeName === 'Discuss' && (
          <AddTopicFab navigate={navigate} />
        )}
      </Portal>
    </>
  );
}

export default BottomTabs;
