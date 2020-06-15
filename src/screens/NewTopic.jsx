// @flow
import React, {
  useState,
  useLayoutEffect,
  useCallback,
  useContext,
} from 'react';
import {
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { TextInput, useTheme, Button } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';

import type { ForumTopic } from '../types';
import config from '../config';
import AccountContext from '../contexts/AccountContext';

const styles = StyleSheet.create({
  container: {
    paddingVertical: config.values.space.large,
    paddingHorizontal: config.values.space.normal,
  },
  textInput: {
    marginTop: 12,
  },
  sendButton: {
    marginRight: config.values.space.small,
  },
});

type Props = {
  route: {
    params: {
      courseId: string,
    },
  },
  navigation: any,
}

function NewTopic({ route, navigation }: Props) {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [sending, setSending] = useState<boolean>(false);
  const { activeAccount } = useContext(AccountContext);

  const theme = useTheme();

  const saveLesson = useCallback(async () => {
    if (!activeAccount) {
      return;
    }

    if (!title) {
      Alert.alert(
        '',
        'Title is required.',
        [{ text: 'OK' }],
      );
      return;
    }

    if (!description) {
      Alert.alert(
        '',
        'Description can\'t be empty.',
        [{ text: 'OK' }],
      );
      return;
    }

    setSending(true);

    if (!activeAccount) {
      return;
    }

    try {
      const topicData: $Diff<ForumTopic, { id: string }> = {
        title,
        description,
        author: activeAccount.id,
        course: route.params.courseId,
        replyCount: 0,
        createdAt: firestore.FieldValue.serverTimestamp(),
      };

      await firestore().collection('forum-topics').add(topicData);
      navigation.goBack();
    } catch (error) {
      setSending(false);
      if (__DEV__) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    }
  }, [activeAccount, description, navigation, route.params.courseId, title]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: (
        <Button
          onPress={saveLesson}
          style={styles.sendButton}
          loading={sending}
        >
          Send
        </Button>
      ),
    });
  }, [navigation, saveLesson, sending, theme.colors.onSurface]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        label="Title"
        mode="outlined"
        value={title}
        style={styles.textInput}
        onChangeText={setTitle}
      />
      <TextInput
        label="Description"
        mode="outlined"
        multiline
        value={description}
        style={styles.textInput}
        onChangeText={setDescription}
      />
    </ScrollView>
  );
}

export default NewTopic;
