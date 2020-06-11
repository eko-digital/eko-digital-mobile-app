// @flow
import React, { useContext, useMemo } from 'react';
import firestore from '@react-native-firebase/firestore';
import { FlatList, StyleSheet } from 'react-native';

import type { Post, PostType } from '../types';
import EmptyScreen from './EmptyScreen';
import AccountContext from '../contexts/AccountContext';
import noLessons from '../images/no-lessons.png';
import noAssignments from '../images/no-assignments.png';
import useDocsQuery from '../hooks/useDocsQuery';
import FullScreenActivityIndicator from './FullScreenActivityIndicator';
import ErrorScreen from './ErrorScreen';
import OfflineScreen from './OfflineScreen';
import PostCard from './PostCard';
import { asTeacher, asStudent } from '../utils';
import config from '../config';

const styles = StyleSheet.create({
  container: {
    padding: config.values.space.normal,
  },
});

type Props = {
  postType: PostType,
}

function Posts({ postType }: Props) {
  const { activeAccount } = useContext(AccountContext);

  const collection = useMemo(() => (postType === 'lesson' ? 'lessons' : 'assignments'), [postType]);
  const isTeacher = Boolean(asTeacher(activeAccount));

  const query = useMemo(() => {
    if (!activeAccount) {
      return null;
    }

    if (asTeacher(activeAccount)) {
      return firestore().collection(collection)
        .where('institute', '==', activeAccount.institute)
        .where('teacher', '==', activeAccount.id)
        .orderBy('createdAt', 'desc');
    }

    const student = asStudent(activeAccount);

    if (!student) {
      return null;
    }

    return firestore().collection(collection)
      .where('class', '==', student.class)
      .where('status', '==', 'available')
      .orderBy('createdAt', 'desc');
  }, [activeAccount, collection]);

  const {
    docs: posts,
    loading,
    loadingError,
    isOffline,
    retry,
  } = useDocsQuery<Post>(query);

  if (!activeAccount) {
    return null;
  }

  if (loading) {
    return <FullScreenActivityIndicator />;
  }

  if (isOffline && posts.length === 0) {
    return <OfflineScreen onRetry={retry} />;
  }

  if (loadingError && posts.length === 0) {
    return (
      <ErrorScreen
        description={`Something went wrong while fetching ${collection}.`}
      />
    );
  }

  if (posts.length === 0) {
    return (
      <EmptyScreen
        illustration={postType === 'lesson' ? noLessons : noAssignments}
        title={`No ${collection}, yet!`}
        description={
          asTeacher(activeAccount)
            ? `You haven't added any ${collection} yet. Add one using the big + button at the bottom right corner.`
            : `Your ${collection} will appear here when your teachers add them. Stay tuned.`
        }
      />
    );
  }

  return (
    <FlatList
      contentContainerStyle={[
        styles.container,
        isTeacher ? { paddingBottom: 100 } : null,
      ]}
      data={posts}
      renderItem={({ item }) => (
        <PostCard
          post={item}
          postType={postType}
          activeAccount={activeAccount}
        />
      )}
      keyExtractor={(item) => item.id}
    />
  );
}

export default Posts;
