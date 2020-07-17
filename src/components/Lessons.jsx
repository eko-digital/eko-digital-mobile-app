// @flow
import React, { useContext, useMemo } from 'react';
import firestore from '@react-native-firebase/firestore';
import { FlatList, StyleSheet } from 'react-native';

import type { Lesson, Course } from '../types';
import EmptyScreen from './EmptyScreen';
import AccountContext from '../contexts/AccountContext';
import noLessons from '../images/no-lessons.png';
import useDocsQuery from '../hooks/useDocsQuery';
import FullScreenActivityIndicator from './FullScreenActivityIndicator';
import ErrorScreen from './ErrorScreen';
import OfflineScreen from './OfflineScreen';
import CourseItem from './CourseItem';
import config from '../config';

const styles = StyleSheet.create({
  container: {
    padding: config.values.space.normal,
  },
});

type Props = {|
  course: Course,
|}

function Lessons({ course }: Props) {
  const { activeAccount } = useContext(AccountContext);

  const query = useMemo(() => {
    if (!activeAccount) {
      return null;
    }

    if (activeAccount?.isTeacher) {
      return firestore().collection('lessons')
        .where('course', '==', course.id)
        .where('teacher', '==', activeAccount.id)
        .orderBy('createdAt', 'desc');
    }

    return firestore().collection('lessons')
      .where('course', '==', course.id)
      .where('status', '==', 'available')
      .orderBy('createdAt', 'desc');
  }, [activeAccount, course.id]);

  const {
    docs: lessons,
    loading,
    loadingError,
    isOffline,
    retry,
  } = useDocsQuery<Lesson>(query);

  if (!activeAccount) {
    return null;
  }

  if (loading) {
    return <FullScreenActivityIndicator />;
  }

  if (isOffline && lessons.length === 0) {
    return <OfflineScreen onRetry={retry} />;
  }

  if (loadingError && lessons.length === 0) {
    return (
      <ErrorScreen
        description="Something went wrong while fetching lessons"
      />
    );
  }

  if (lessons.length === 0) {
    return (
      <EmptyScreen
        illustration={noLessons}
        title="No lessons, yet!"
        description={
          activeAccount?.isTeacher
            ? 'You haven\'t added any lessons yet. Add one using the big + button at the bottom right corner.'
            : 'Your lessons will appear here when your teachers add them. Stay tuned.'
        }
      />
    );
  }

  return (
    <FlatList
      contentContainerStyle={[
        styles.container,
        activeAccount?.isTeacher ? { paddingBottom: 100 } : null,
      ]}
      data={lessons}
      renderItem={({ item }) => (
        <CourseItem
          item={item}
          itemType="lesson"
          activeAccount={activeAccount}
        />
      )}
      keyExtractor={(item) => item.id}
    />
  );
}

export default Lessons;
