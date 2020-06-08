// @flow
import React, { useMemo, useCallback } from 'react';
import {
  Card,
  useTheme,
  TouchableRipple,
  Title,
  Paragraph,
} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import type { ForumTopic, ForumUser } from '../types';
import config from '../config';
import useDoc from '../hooks/useDoc';
import ForumItemMeta from './ForumItemMeta';

const styles = StyleSheet.create({
  card: {
    marginBottom: config.values.space.small,
    overflow: 'hidden',
  },
  button: {
    paddingVertical: config.values.space.normal,
  },
  title: {
    marginTop: config.values.space.small,
    marginBottom: 0,
    fontSize: 20,
    lineHeight: 25,
  },
  replies: {
    marginTop: config.values.space.small,
    flexDirection: 'row',
    alignItems: 'center',
  },
  repliesIcon: {
    marginRight: config.values.space.small,
  },
});

type Props = {
  topic: ForumTopic,
}

function TopicCard({ topic }: Props) {
  const theme = useTheme();
  const { navigate } = useNavigation();

  const docRef = useMemo(() => firestore().collection('forum-users').doc(topic.author), [topic.author]);
  const {
    loadingError,
    data: author,
  } = useDoc<ForumUser>(docRef);

  const replyCount = useMemo(
    () => (topic.replyCount > 0 ? topic.replyCount : 0),
    [topic.replyCount],
  );

  const navigateToTopic = useCallback(() => {
    if (!author) {
      return;
    }
    navigate('TopicScreen', { topic, author });
  }, [author, navigate, topic]);

  if (!author || loadingError) {
    return null; // TODO: maybe show inline error
  }

  return (
    <Card style={styles.card}>
      <TouchableRipple style={styles.button} onPress={navigateToTopic}>
        <Card.Content>
          <ForumItemMeta timestamp={topic.createdAt} author={author} />
          <Title style={styles.title}>{topic.title}</Title>
          <View style={styles.replies}>
            <MaterialCommunityIcons
              name="android-messages"
              color={theme.colors.primary}
              size={16}
              style={styles.repliesIcon}
            />
            <Paragraph style={{ color: theme.colors.primary }}>
              {replyCount === 1 ? '1 reply' : `${replyCount} replies`}
            </Paragraph>
          </View>
        </Card.Content>
      </TouchableRipple>
    </Card>
  );
}

export default TopicCard;
