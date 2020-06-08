// @flow
import React, { useCallback, useState, useContext } from 'react';
import { TextInput, StyleSheet } from 'react-native';
import {
  IconButton,
  useTheme,
  Surface,
  Snackbar,
  ActivityIndicator,
} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';

import type { ForumReply } from '../types';
import AccountContext from '../contexts/AccountContext';
import config from '../config';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-end',
    elevation: 5,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.01)',
  },
  input: {
    flex: 1,
    paddingLeft: config.values.space.normal,
    paddingRight: config.values.space.normal + 30,
  },
  button: {
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
  spinner: {
    position: 'absolute',
    right: config.values.space.normal,
    bottom: 12,
  },
});

type Props = {
  topicId: string,
}

function TopicReplyField({ topicId }: Props) {
  const [message, setMessage] = useState<string>('');
  const [sending, setSending] = useState<boolean>(false);
  const [showErrorMessage, setShowErrorMessage] = useState<boolean>(false);
  const { activeAccount } = useContext(AccountContext);

  const theme = useTheme();

  const hideErrorMessage = useCallback(() => {
    setShowErrorMessage(false);
  }, []);

  const postReply = useCallback(async () => {
    if (!activeAccount || message.trim().length === 0) {
      return;
    }

    setSending(true);
    setShowErrorMessage(false);

    try {
      const topicData: $Diff<ForumReply, { id: string }> = {
        topic: topicId,
        description: message,
        author: activeAccount.id,
        createdAt: firestore.FieldValue.serverTimestamp(),
      };

      await firestore().collection('forum-replies').add(topicData);
      setMessage('');
    } catch (error) {
      if (__DEV__) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
      setShowErrorMessage(true);
    }

    setSending(false);
  }, [activeAccount, message, topicId]);

  return (
    <Surface style={[styles.container, { borderRadius: theme.roundness }]}>
      <TextInput
        multiline
        style={[styles.input, { color: theme.colors.text }]}
        value={message}
        placeholder="Type your reply..."
        placeholderTextColor={theme.colors.placeholder}
        onChangeText={setMessage}
      />
      {sending ? (
        <ActivityIndicator
          color={theme.colors.primary}
          style={styles.spinner}
        />
      ) : (
        <IconButton
          icon="send"
          color={theme.colors.primary}
          style={styles.button}
          onPress={postReply}
          disabled={message.trim().length === 0}
        />
      )}
      <Snackbar
        visible={showErrorMessage}
        onDismiss={hideErrorMessage}
        action={{
          label: 'Retry',
          onPress: postReply,
        }}
      >
        Oops… Unexpected error occurred.
      </Snackbar>
    </Surface>
  );
}

export default TopicReplyField;
