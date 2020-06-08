// @flow
import React, { useMemo } from 'react';
import {
  Card,
  Paragraph,
} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import { StyleSheet } from 'react-native';

import type { ForumReply, ForumUser } from '../types';
import config from '../config';
import useDoc from '../hooks/useDoc';
import ForumItemMeta from './ForumItemMeta';

const styles = StyleSheet.create({
  card: {
    marginBottom: config.values.space.small,
    overflow: 'hidden',
  },
  description: {
    paddingTop: config.values.space.normal,
  },
});

type Props = {
  reply: ForumReply,
}

function ReplyCard({ reply }: Props) {
  const docRef = useMemo(() => firestore().collection('forum-users').doc(reply.author), [reply.author]);
  const {
    loadingError,
    data: author,
  } = useDoc<ForumUser>(docRef);

  if (!author || loadingError) {
    return null; // TODO: maybe show inline error
  }

  return (
    <Card style={styles.card}>
      <Card.Content>
        <ForumItemMeta timestamp={reply.createdAt} author={author} />
        <Paragraph style={styles.description}>{reply.description}</Paragraph>
      </Card.Content>
    </Card>
  );
}

export default ReplyCard;
