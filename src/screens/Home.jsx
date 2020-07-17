// @flow
import React, { useContext } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import config from '../config';
import AccountContext from '../contexts/AccountContext';
import noLessons from '../images/no-lessons.png';
import InstituteContext from '../contexts/InstituteContext';
import EmptyScreen from '../components/EmptyScreen';
import CourseList from '../components/CourseList';
import TodaysPosts from '../components/TodaysPosts';

const styles = StyleSheet.create({
  container: {
    padding: config.values.space.normal,
  },
});

function Home() {
  const { activeAccount } = useContext(AccountContext);
  const { institute } = useContext(InstituteContext);

  if (!activeAccount || !institute) {
    return null;
  }

  if (!activeAccount.courses || activeAccount.courses.length === 0) {
    return (
      <EmptyScreen
        title={`No ${institute.i18n.coursePlural}!`}
        description={`Your ${institute.type} hasn't assigned you any ${institute.i18n.coursePlural} yet.`}
        illustration={noLessons}
      />
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TodaysPosts />
      {/* TODO: Upcoming classes/assignments */}
      <CourseList />
    </ScrollView>
  );
}

export default Home;
