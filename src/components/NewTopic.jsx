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
import { asStudent, asTeacher } from '../utils';
import ClassPicker from './ClassPicker';

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
  navigation: any,
}

function NewLesson({ navigation }: Props) {
  const [classId, setClassId] = useState<string | null>(null);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [sending, setSending] = useState<boolean>(false);
  const { activeAccount } = useContext(AccountContext);

  const theme = useTheme();

  const saveLesson = useCallback(async () => {
    const isTeacher = Boolean(asTeacher(activeAccount));
    const student = asStudent(activeAccount);

    if (!title) {
      Alert.alert(
        '',
        'Title is required.',
        [{ text: 'OK' }],
      );
      return;
    }

    if (isTeacher && !classId) {
      Alert.alert(
        '',
        'Please select a class.',
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
      const topicClass = student ? student.class : classId;
      if (!topicClass) {
        throw new Error('Topic class can\'t be empty.');
      }

      const topicData: $Diff<ForumTopic, { id: string }> = {
        title,
        description,
        author: activeAccount.id,
        class: topicClass,
        replyCount: 0,
        createdAt: firestore.FieldValue.serverTimestamp(),
      };

      await firestore().collection('forum-topics').add(topicData);
      navigation.goBack();
    } catch (error) {
      setSending(false);
      console.error(error);
    }
  }, [activeAccount, classId, description, navigation, title]);

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
      {asTeacher(activeAccount) && (
        <ClassPicker
          account={activeAccount}
          classId={classId}
          onChange={setClassId}
        />
      )}

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

export default NewLesson;
