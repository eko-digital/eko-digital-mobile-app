// @flow
import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import auth from '@react-native-firebase/auth';

import { asTeacher, asStudent, capitalize } from '../utils';
import Header from './Header';
import BottomTabs from './BottomTabs';
import NewPost from './NewPost';
import NewTopic from './NewTopic';
import AccountNotFound from './AccountNotFound';
import AccountContext from '../contexts/AccountContext';
import AccountLoadingError from './AccountLoadingError';
import Profile from './Profile';
import Favourites from './Favourites';
import Settings from './Settings';
import Institute from './Institute';
import FullScreenImage from './FullScreenImage';
import VideoScreen from './VideoScreen';
import TopicScreen from './TopicScreen';
import useInstitute from '../hooks/useInstitute';
import VerifyEmail from './VerifyEmail';

const Stack = createStackNavigator();

function StackNavigator() {
  const { activeAccount, loadingError } = useContext(AccountContext);
  const { institute } = useInstitute(activeAccount);

  const authUser = auth().currentUser;

  let screens = null;

  if (loadingError && !activeAccount) {
    screens = (
      <Stack.Screen
        name="AccountLoadingError"
        component={AccountLoadingError}
        options={{ title: 'Eko Digital' }}
      />
    );
  } else if (authUser.email && !authUser.emailVerified) {
    screens = (
      <Stack.Screen
        name="VerifyEmail"
        component={VerifyEmail}
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
        {asStudent(activeAccount) && (
          <Stack.Screen
            name="Favourites"
            component={Favourites}
            options={{ title: 'Favourites' }}
          />
        )}
        <Stack.Screen
          name="Settings"
          component={Settings}
          options={{ title: 'Settings' }}
        />
        <Stack.Screen
          name="Institute"
          component={Institute}
          options={{ title: capitalize(institute?.type || 'institute') }}
        />
        <Stack.Screen
          name="FullScreenImage"
          component={FullScreenImage}
          options={({ route }) => ({ title: route.params.title })}
        />
        <Stack.Screen
          name="VideoScreen"
          component={VideoScreen}
          options={({ route }) => ({ title: route.params.post.title })}
        />
        {asTeacher(activeAccount) && (
          <>
            <Stack.Screen
              name="NewPost"
              component={NewPost}
              options={({ route }) => ({ title: `Add new ${route.params.postType}` })}
            />
          </>
        )}
        <Stack.Screen
          name="NewTopic"
          component={NewTopic}
          options={{ title: 'Add new topic' }}
        />
        <Stack.Screen
          name="TopicScreen"
          component={TopicScreen}
          options={({ route }) => ({ title: route.params.topic.title })}
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
