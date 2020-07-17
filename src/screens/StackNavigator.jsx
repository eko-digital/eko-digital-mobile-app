// @flow
import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import auth from '@react-native-firebase/auth';

import { capitalize } from '../utils';
import Header from '../components/Header';
import AccountContext from '../contexts/AccountContext';
import BottomTabs from './BottomTabs';
import Course from './Course';
import NewLesson from './NewLesson';
import NewAssignment from './NewAssignment';
import NewTopic from './NewTopic';
import SingleCourseItem from './SingleCourseItem';
import AccountLoadingError from './AccountLoadingError';
import InstituteLoadingError from './InstituteLoadingError';
import Notifications from './Notifications';
import Institute from './Institute';
import FullScreenImage from './FullScreenImage';
import TopicScreen from './TopicScreen';
import VerifyEmail from './VerifyEmail';
import InstituteContext from '../contexts/InstituteContext';
import ScheduleLiveClass from './ScheduleLiveClass';
import LiveClass from './LiveClass';
import JitsiMeet from './JitsiMeet';

const Stack = createStackNavigator();

function StackNavigator() {
  const { activeAccount, loadingError } = useContext(AccountContext);
  const { institute, loadingError: instituteLoadingError } = useContext(InstituteContext);

  const authUser = auth().currentUser;

  if (!activeAccount) {
    return null;
  }

  let screens = null;

  if (instituteLoadingError && !institute) {
    screens = (
      <Stack.Screen
        name="InstituteLoadingError"
        component={InstituteLoadingError}
        options={{ title: 'Eko Digital' }}
      />
    );
  } if (loadingError && !activeAccount) {
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
    screens = (
      <>
        <Stack.Screen
          name="Tabs"
          component={BottomTabs}
          options={({ route }) => {
            const routeName = route.state
              ? route.state.routes[route.state.index].name
              : 'Home';
            const headerTitle = routeName === 'Home'
              ? `Hello, ${activeAccount.name.split(' ')[0]}`
              : routeName;
            const hasTabs = routeName === 'Bookmarks';
            return { headerTitle, hasTabs };
          }}
        />
        <Stack.Screen
          name="Notifications"
          component={Notifications}
          options={{ title: 'Notifications' }}
        />
        <Stack.Screen
          name="Institute"
          component={Institute}
          options={{ title: capitalize(institute?.type || 'institute') }}
        />
        <Stack.Screen
          name="Course"
          component={Course}
          options={{ title: '' }}
        />
        <Stack.Screen
          name="FullScreenImage"
          component={FullScreenImage}
          options={({ route }) => ({ title: route.params.title })}
        />
        {activeAccount.isTeacher && (
          <>
            <Stack.Screen
              name="ScheduleLiveClass"
              component={ScheduleLiveClass}
              options={({ title: 'Schedule live class' })}
            />
            <Stack.Screen
              name="NewLesson"
              component={NewLesson}
              options={({ title: 'Add new lesson' })}
            />
            <Stack.Screen
              name="NewAssignment"
              component={NewAssignment}
              options={({ title: 'Add new assignment' })}
            />
          </>
        )}
        <Stack.Screen
          name="LiveClass"
          component={LiveClass}
          options={{ title: 'Live class' }}
        />
        <Stack.Screen
          name="JitsiMeet"
          component={JitsiMeet}
          options={{ header: () => null }}
        />
        <Stack.Screen
          name="SingleCourseItem"
          component={SingleCourseItem}
          options={({ route }) => ({ title: capitalize(route.params.itemType) })}
        />
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
