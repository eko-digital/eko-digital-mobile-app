// @flow
import React, {
  useState,
  useContext,
  useLayoutEffect,
  useCallback,
  useMemo,
} from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Alert,
  Keyboard,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import { TextInput, useTheme, Button } from 'react-native-paper';
import Upload from 'react-native-background-upload';

import type {
  DocumentPickerResult,
  Post,
  PostType,
  PostFormat,
} from '../types';
import ImagePicker from './ImagePicker';
import VideoPicker from './VideoPicker';
import PDFPicker from './PDFPicker';
import AccountContext from '../contexts/AccountContext';
import { getCallableFunction, getAttachmentPath } from '../utils';
import ClassSubjectPicker from './ClassSubjectPicker';
import config from '../config';
import useInstitute from '../hooks/useInstitute';

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
      postType: PostType,
      postFormat: PostFormat,
    },
  },
  navigation: any,
}

function NewPost({ route, navigation }: Props) {
  const [classId, setClassId] = useState<string | null>(null);
  const [subject, setSubject] = useState<string | null>(null);
  const [file, setFile] = useState<DocumentPickerResult | null>(null);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [sending, setSending] = useState<boolean>(false);
  const { activeAccount } = useContext(AccountContext);
  const { postType, postFormat } = route.params;
  const { institute } = useInstitute(activeAccount);

  const theme = useTheme();
  const collection = useMemo(() => (postType === 'lesson' ? 'lessons' : 'assignments'), [postType]);

  const savePost = useCallback(async () => {
    Keyboard.dismiss();

    if (postFormat !== 'text' && !file) {
      Alert.alert(
        '',
        `Please select ${postFormat === 'image' ? 'an image' : `a ${postFormat}`} to upload.`,
        [{ text: 'OK' }],
      );
      return;
    }

    if (!classId) {
      Alert.alert(
        '',
        'Please select a class/subject.',
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
      const post: $Diff<Post, { id: string }> = {
        type: postFormat,
        title,
        description,
        class: classId,
        teacher: activeAccount.id,
        institute: activeAccount.institute,
        status: postFormat === 'video' ? 'uploading' : 'available',
        createdAt: firestore.FieldValue.serverTimestamp(),
      };

      if (subject) {
        post.subject = subject;
      }

      const postRef = firestore().collection(collection).doc();
      const attachmentPath = getAttachmentPath(
        currentUser,
        activeAccount,
        collection,
        postRef.id,
      );
      const attachmentRef = storage().ref(attachmentPath);

      if (postFormat === 'image' || postFormat === 'pdf') {
        if (!file) {
          throw new Error('File can\'t be null');
        }

        const blob = await fetch(file.uri).then((res) => res.blob());
        await attachmentRef.put(blob);
        blob.close();
        post.attachment = await attachmentRef.getDownloadURL();
        post.attachmentName = file.name;
        post.attachmentSize = file.size;
      }

      if (postFormat === 'video' && postType === 'lesson' && file) {
        const getVideoUploadURL = await getCallableFunction('getVideoUploadURL');
        const { data: { uploadURL, videoId, token } } = await getVideoUploadURL({
          teacherId: activeAccount.id,
        });

        await Upload.startUpload({
          url: uploadURL,
          path: file.uri,
          method: 'POST',
          type: 'multipart',
          field: 'file',
          customUploadId: postRef.id,
          headers: {
            'content-type': file.type,
          },
          notification: {
            enabled: true,
            autoClear: true,
            enableRingTone: false,
            onProgressTitle: 'Uploading',
            onProgressMessage: title,
          },
        });
        post.videoId = videoId;
        post.videoToken = token;
      }

      await postRef.set(post);

      navigation.goBack();
    } catch (error) {
      setSending(false);
      Alert.alert(
        'Oops!',
        `Something went wrong while saving this ${postType}.`
          + ` Please try again or contact your ${institute?.type || 'institute'} if the issue persists.`,
        [
          { text: 'OK', style: 'cancel' },
          { text: 'Retry', onPress: savePost },
        ],
      );
      console.error(error);
    }
  }, [
    postFormat,
    file,
    classId,
    title,
    activeAccount,
    description,
    subject,
    collection,
    postType,
    navigation,
    institute,
  ]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: (
        <Button
          onPress={savePost}
          style={styles.sendButton}
          loading={sending}
        >
          Send
        </Button>
      ),
    });
  }, [navigation, savePost, sending, theme.colors.onSurface]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {postFormat === 'image' && (
        <ImagePicker
          image={file}
          onChange={setFile}
        />
      )}
      {postFormat === 'video' && (
        <VideoPicker
          video={file}
          onChange={setFile}
        />
      )}
      {postFormat === 'pdf' && (
        <PDFPicker
          pdf={file}
          onChange={setFile}
        />
      )}

      <View style={{ height: 12 }} />

      <ClassSubjectPicker
        account={activeAccount}
        onClassIdChange={setClassId}
        onSubjectChange={setSubject}
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
        value={description}
        style={styles.textInput}
        onChangeText={setDescription}
      />
    </ScrollView>
  );
}

export default NewPost;
