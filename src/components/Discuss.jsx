// @flow
import React, { useCallback, useMemo, useContext } from 'react';
import { StyleSheet, FlatList } from 'react-native';
import firestore from '@react-native-firebase/firestore';

import type { Course, ForumTopic } from '../types';
import config from '../config';
import EmptyScreen from './EmptyScreen';
import ErrorScreen from './ErrorScreen';
import OfflineScreen from './OfflineScreen';
import TopicCard from './TopicCard';
import useDocsQuery from '../hooks/useDocsQuery';
import discussion from '../images/discussion.png';
import AccountContext from '../contexts/AccountContext';
import FullScreenActivityIndicator from './FullScreenActivityIndicator';

const styles = StyleSheet.create({
  container: {
    padding: config.values.space.normal,
  },
});

type Props = {|
  course: Course,
|}

function Discuss({ course }: Props) {
  const { activeAccount } = useContext(AccountContext);

  const query = useMemo(() => {
    if (!activeAccount) {
      return null;
    }

    return firestore().collection('forum-topics')
      .where('course', '==', course.id)
      .orderBy('createdAt', 'desc');
  }, [activeAccount, course.id]);

  const {
    docs: topics,
    loading,
    loadingError,
    isOffline,
    retry,
  } = useDocsQuery<ForumTopic>(query);

  const renderItem = useCallback(({ item: topic }) => (
    <TopicCard topic={topic} />
  ), []);

  if (!activeAccount) {
    return null;
  }

  if (loading) {
    return <FullScreenActivityIndicator />;
  }

  if (isOffline && topics.length === 0) {
    return <OfflineScreen onRetry={retry} />;
  }

  if (loadingError && topics.length === 0) {
    return (
      <ErrorScreen
        description="Something went wrong while fetching topics."
      />
    );
  }

  return (
    <>
      {topics.length === 0 ? (
        <EmptyScreen
          illustration={discussion}
          title="Start discussion"
          description={
            activeAccount.isTeacher
              ? 'Create a new topic to start discussion.'
              + ' Your students and fellow teachers can view and comment on your topic.'
              : 'Create a new topic to start discussion.'
              + ' Your classmates & teachers can view and comment on your topic.'
          }
        />
      ) : (
        <FlatList
          contentContainerStyle={styles.container}
          data={topics}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      )}
    </>
  );
}

export default Discuss;
