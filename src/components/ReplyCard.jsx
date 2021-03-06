// @flow
import React, { useMemo, useContext, useCallback } from 'react';
import { Card } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import { StyleSheet } from 'react-native';

import type { ForumReply, ForumUser } from '../types';
import config from '../config';
import useDoc from '../hooks/useDoc';
import ForumItemMeta from './ForumItemMeta';
import AccountContext from '../contexts/AccountContext';
import BodyText from './BodyText';

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
  const { activeAccount } = useContext(AccountContext);

  const docRef = useMemo(() => firestore().collection('forum-users').doc(reply.author), [reply.author]);
  const {
    loadingError,
    data: author,
  } = useDoc<ForumUser>(docRef);

  const deleteReply = useCallback(async () => {
    await firestore().collection('forum-replies').doc(reply.id).delete();
  }, [reply.id]);

  const actions = useMemo(() => {
    if (!author || !activeAccount) {
      return null;
    }

    // a teacher can delete their own replies or those added by a student
    if ((activeAccount.isTeacher && !author.isTeacher) || (activeAccount.id === reply.author)) {
      return [{
        title: 'Delete reply',
        icon: 'delete',
        onAction: deleteReply,
      }];
    }

    return null;
  }, [activeAccount, author, deleteReply, reply.author]);

  if (!author || loadingError) {
    return null; // TODO: maybe show inline error
  }

  return (
    <Card style={styles.card}>
      <Card.Content>
        <ForumItemMeta
          timestamp={reply.createdAt}
          author={author}
          actions={actions}
        />
        <BodyText style={styles.description}>{reply.description}</BodyText>
      </Card.Content>
    </Card>
  );
}

export default ReplyCard;
