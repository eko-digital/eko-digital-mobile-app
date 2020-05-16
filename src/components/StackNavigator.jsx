// @flow
import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import BottomTabs from './BottomTabs';
import AccountNotFound from './AccountNotFound';
import Header from './Header';
import AccountContext from '../contexts/AccountContext';

const Stack = createStackNavigator();

function StackNavigator() {
  const { account } = useContext(AccountContext);

  return (
    <Stack.Navigator
      initialRouteName="LessonsList"
      headerMode="screen"
      screenOptions={{
        header: Header,
      }}
    >
      {account ? (
        <Stack.Screen
          name="LessonsList"
          component={BottomTabs}
          options={({ route }) => {
            const routeName = route.state
              ? route.state.routes[route.state.index].name
              : 'Lessons';
            return { headerTitle: routeName };
          }}
        />
      ) : (
        <Stack.Screen
          name="AccountNotFound"
          component={AccountNotFound}
          options={{ title: 'Eko Digital' }}
        />
      )}
    </Stack.Navigator>
  );
}

export default StackNavigator;
