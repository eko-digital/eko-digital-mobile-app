// @flow
import React, { useMemo, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import {
  Paragraph,
  Card,
  Title,
  Subheading,
} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';

import type { ForumTopic, ForumReply, ForumUser } from '../types';
import config from '../config';
import ForumItemMeta from '../components/ForumItemMeta';
import TopicReplyField from '../components/TopicReplyField';
import ReplyCard from '../components/ReplyCard';
import useDocsQuery from '../hooks/useDocsQuery';
import FullScreenActivityIndicator from '../components/FullScreenActivityIndicator';
import OfflineScreen from '../components/OfflineScreen';
import ErrorScreen from '../components/ErrorScreen';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    padding: config.values.space.normal,
    paddingBottom: config.values.space.normal + 42, // space for input field
  },
  repliesHeading: {
    marginTop: config.values.space.normal,
    marginBottom: config.values.space.extraSmall,
  },
  title: {
    marginTop: config.values.space.small,
    marginBottom: 14,
    fontSize: 20,
    lineHeight: 25,
  },
});

type Props = {
  route: {
    params: {
      topic: ForumTopic,
      author: ForumUser,
    },
  },
}

function TopicScreen({ route }: Props) {
  const { topic, author } = route.params;

  const query = useMemo(
    () => firestore().collection('forum-replies').where('topic', '==', topic.id).orderBy('createdAt', 'asc'),
    [topic.id],
  );

  const renderReply = useCallback(({ item }) => (
    <ReplyCard reply={item} />
  ), []);

  const {
    loading,
    loadingError,
    isOffline,
    docs: replies,
    retry,
  } = useDocsQuery<ForumReply>(query);

  const listHeader = useMemo(() => (
    <View>
      <Card>
        <Card.Content>
          <ForumItemMeta timestamp={topic.createdAt} author={author} />
          <Title style={styles.title}>{topic.title}</Title>
          <Paragraph>
            {topic.description}
          </Paragraph>
        </Card.Content>
      </Card>
      {replies.length > 0 && (
        <Subheading style={styles.repliesHeading}>Replies</Subheading>
      )}
    </View>
  ), [author, replies.length, topic.createdAt, topic.description, topic.title]);

  if (loading) {
    return <FullScreenActivityIndicator />;
  }

  if (isOffline && replies.length === 0) {
    return <OfflineScreen onRetry={retry} />;
  }

  if (loadingError && replies.length === 0) {
    return (
      <ErrorScreen
        description="Oops! Something went wrong while fetching replies."
      />
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        ListHeaderComponent={listHeader}
        contentContainerStyle={styles.listContainer}
        data={replies}
        renderItem={renderReply}
        keyExtractor={(item) => item.id}
      />
      <TopicReplyField topicId={topic.id} />
    </View>
  );
}

export default TopicScreen;
