// @flow
import React, { useContext, useMemo, useCallback } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';

import type { ForumTopic } from '../types';
import config from '../config';
import EmptyScreen from './EmptyScreen';
import AccountContext from '../contexts/AccountContext';
import discuss from '../images/discuss.png';
import useDocsQuery from '../hooks/useDocsQuery';
import FullScreenActivityIndicator from './FullScreenActivityIndicator';
import OfflineScreen from './OfflineScreen';
import ErrorScreen from './ErrorScreen';
import TopicCard from './TopicCard';

const styles = StyleSheet.create({
  container: {
    padding: config.values.space.normal,
    paddingBottom: 100, // space for FAB
  },
});

function Discuss() {
  const { activeAccount } = useContext(AccountContext);

  const query = useMemo(() => {
    if (!activeAccount) {
      return null;
    }

    if (activeAccount.isTeacher) {
      return firestore().collection('forum-topics')
        .where('class', 'in', activeAccount.courses)
        .orderBy('createdAt', 'desc');
    }

    return firestore().collection('forum-topics')
      .where('class', '==', activeAccount.class)
      .orderBy('createdAt', 'desc');
  }, [activeAccount]);

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

  if (topics.length === 0) {
    return (
      <EmptyScreen
        illustration={discuss}
        title="Start discussion"
        description={
          activeAccount.isTeacher
            ? 'Create a new topic to start discussion.'
            + ' Your students and fellow teachers can view and comment on your topic.'
            : 'Create a new topic to start discussion.'
              + ' Your classmates & teachers can view and comment on your topic.'
        }
      />
    );
  }

  return (
    <FlatList
      contentContainerStyle={styles.container}
      data={topics}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
    />
  );
}

export default Discuss;
