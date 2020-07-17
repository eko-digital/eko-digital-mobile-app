// @flow
import React, { useContext, useMemo } from 'react';
import firestore from '@react-native-firebase/firestore';
import { FlatList, StyleSheet } from 'react-native';

import type { Assignment, Course } from '../types';
import EmptyScreen from './EmptyScreen';
import AccountContext from '../contexts/AccountContext';
import noAssignments from '../images/no-assignments.png';
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

function Assignments({ course }: Props) {
  const { activeAccount } = useContext(AccountContext);

  const query = useMemo(() => {
    if (!activeAccount) {
      return null;
    }

    if (activeAccount?.isTeacher) {
      return firestore().collection('assignments')
        .where('course', '==', course.id)
        .where('teacher', '==', activeAccount.id)
        .orderBy('createdAt', 'desc');
    }

    return firestore().collection('assignments')
      .where('course', '==', course.id)
      .orderBy('createdAt', 'desc');
  }, [activeAccount, course.id]);

  const {
    docs: assignments,
    loading,
    loadingError,
    isOffline,
    retry,
  } = useDocsQuery<Assignment>(query);

  if (!activeAccount) {
    return null;
  }

  if (loading) {
    return <FullScreenActivityIndicator />;
  }

  if (isOffline && assignments.length === 0) {
    return <OfflineScreen onRetry={retry} />;
  }

  if (loadingError && assignments.length === 0) {
    return (
      <ErrorScreen
        description="Something went wrong while fetching assignments"
      />
    );
  }

  if (assignments.length === 0) {
    return (
      <EmptyScreen
        illustration={noAssignments}
        title="No assignments, yet!"
        description={
          activeAccount?.isTeacher
            ? 'You haven\'t added any assignments yet. Add one using the big + button at the bottom right corner.'
            : 'Your assignments will appear here when your teachers add them. Stay tuned.'
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
      data={assignments}
      renderItem={({ item }) => (
        <CourseItem
          item={item}
          itemType="assignment"
          activeAccount={activeAccount}
        />
      )}
      keyExtractor={(item) => item.id}
    />
  );
}

export default Assignments;
