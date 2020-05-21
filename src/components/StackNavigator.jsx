// @flow
import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Header from './Header';
import BottomTabs from './BottomTabs';
import NewLesson from './NewLesson';
import NewAssignment from './NewAssignment';
import NewTopic from './NewTopic';
import AccountNotFound from './AccountNotFound';
import AccountContext from '../contexts/AccountContext';
import AccountLoadingError from './AccountLoadingError';
import Profile from './Profile';
import Favourites from './Favourites';
import Settings from './Settings';
import School from './School';

const Stack = createStackNavigator();

function StackNavigator() {
  const { activeAccount, loadingError } = useContext(AccountContext);

  let screens = null;

  if (loadingError && !activeAccount) {
    screens = (
      <Stack.Screen
        name="AccountLoadingError"
        component={AccountLoadingError}
        options={{ title: 'Eko Digital' }}
      />
    );
  } else {
    screens = activeAccount ? (
      <>
        <Stack.Screen
          name="Tabs"
          component={BottomTabs}
          options={({ route }) => {
            const routeName = route.state
              ? route.state.routes[route.state.index].name
              : 'Lessons';
            return { headerTitle: routeName };
          }}
        />
        <Stack.Screen
          name="Profile"
          component={Profile}
          options={{ title: 'Profile' }}
        />
        <Stack.Screen
          name="Favourites"
          component={Favourites}
          options={{ title: 'Favourites' }}
        />
        <Stack.Screen
          name="Settings"
          component={Settings}
          options={{ title: 'Settings' }}
        />
        <Stack.Screen
          name="School"
          component={School}
          options={{ title: 'School' }}
        />
        <Stack.Screen
          name="NewLesson"
          component={NewLesson}
          options={{ title: 'Add new lesson' }}
        />
        <Stack.Screen
          name="NewAssignment"
          component={NewAssignment}
          options={{ title: 'Add new assignment' }}
        />
        <Stack.Screen
          name="NewTopic"
          component={NewTopic}
          options={{ title: 'Add new topic' }}
        />
      </>
    ) : (
      <Stack.Screen
        name="AccountNotFound"
        component={AccountNotFound}
        options={{ title: 'Eko Digital' }}
      />
    );
  }

  return (
    <Stack.Navigator
      initialRouteName="Tabs"
      headerMode="screen"
      screenOptions={{
        header: Header,
      }}
    >
      {screens}
    </Stack.Navigator>
  );
}

export default StackNavigator;
