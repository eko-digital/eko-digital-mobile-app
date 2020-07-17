// @flow
import React, {
  useState,
  useContext,
  useLayoutEffect,
  useCallback,
} from 'react';
import {
  StyleSheet,
  ScrollView,
  Alert,
  Keyboard,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {
  TextInput, useTheme, Button,
} from 'react-native-paper';

import type {
  DocumentPickerResult,
  Lesson,
  Attachment,
  AttachmentType,
} from '../types';
import AccountContext from '../contexts/AccountContext';
import { capitalize } from '../utils';
import config from '../config';
import InstituteContext from '../contexts/InstituteContext';
import AttachmentPicker from '../components/AttachmentPicker';
import useAttachmentUploader from '../hooks/useAttachmentUploader';

const styles = StyleSheet.create({
  container: {
    paddingVertical: config.values.space.large,
    paddingHorizontal: config.values.space.normal,
  },
  attachmentPicker: {
    marginBottom: config.values.space.small,
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

function NewLesson({ route, navigation }: Props) {
  const [file, setFile] = useState<DocumentPickerResult | null>(null);
  const [attachmentType, setAttachmentType] = useState<AttachmentType | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [sending, setSending] = useState<boolean>(false);
  const { activeAccount } = useContext(AccountContext);
  const { institute, courses } = useContext(InstituteContext);

  const { params: { courseId } } = route;

  const theme = useTheme();
  const { upload } = useAttachmentUploader();

  const handlePickerChange = useCallback((
    newFile: DocumentPickerResult | null,
    newAttachmentType: AttachmentType | null,
  ) => {
    setFile(newFile);
    setAttachmentType(newAttachmentType);
  }, []);

  const saveLesson = useCallback(async () => {
    Keyboard.dismiss();
    if (!institute) {
      return;
    }

    if (!courseId) {
      Alert.alert(
        '',
        `${capitalize(institute.i18n.courseSingular)} is required.`,
        [{ text: 'OK' }],
      );
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

    const { currentUser } = auth();

    if (!activeAccount || !currentUser) {
      return;
    }

    setSending(true);

    try {
      const lessonRef = firestore().collection('lessons').doc();

      let attachment: Attachment | null = null;
      if (file && attachmentType) {
        attachment = await upload({
          docId: lessonRef.id,
          collection: 'lessons',
          file,
          attachmentType,
          onProgressMessage: title,
        });
      }

      const lesson: $Diff<Lesson, { id: string }> = {
        type: 'upload',
        title,
        description,
        course: courseId,
        teacher: activeAccount.id,
        institute: activeAccount.institute,
        status: attachment ? 'uploading' : 'available',
        createdAt: firestore.FieldValue.serverTimestamp(),
      };

      if (attachment) {
        if (attachment.type === 'audio' && duration) {
          attachment.duration = duration;
        }
        lesson.attachment = attachment;
      }

      await lessonRef.set(lesson);

      navigation.goBack();
    } catch (error) {
      setSending(false);
      Alert.alert(
        'Oops!',
        'Something went wrong while uploading this lesson.'
          + ` Please try again or contact your ${institute?.type || 'institute'} if the issue persists.`,
        [
          { text: 'OK', style: 'cancel' },
          { text: 'Retry', onPress: saveLesson },
        ],
      );

      if (__DEV__) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    }
  // eslint-disable-next-line max-len
  }, [institute, courseId, title, activeAccount, file, attachmentType, description, navigation, upload, duration]);

  useLayoutEffect(() => {
    const course = courses.find((c) => c.id === courseId);
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
      subtitle: course?.name,
    });
  }, [courseId, courses, navigation, saveLesson, sending, theme.colors.onSurface]);

  if (!institute) {
    return null;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <AttachmentPicker
        style={styles.attachmentPicker}
        onChange={handlePickerChange}
        onDuration={setDuration}
      />

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
        numberOfLines={8}
        value={description}
        style={styles.textInput}
        onChangeText={setDescription}
      />
    </ScrollView>
  );
}

export default NewLesson;
