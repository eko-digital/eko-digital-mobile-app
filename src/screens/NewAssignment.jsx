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
  Alert,
  Keyboard,
} from 'react-native';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import firestore from '@react-native-firebase/firestore';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import auth from '@react-native-firebase/auth';
import {
  TextInput, useTheme, Button, TouchableRipple, Text,
} from 'react-native-paper';

import type {
  DocumentPickerResult,
  Assignment,
  Attachment,
  AttachmentType,
  AssignmentSubmissionType,
} from '../types';
import AccountContext from '../contexts/AccountContext';
import { capitalize } from '../utils';
import config from '../config';
import InstituteContext from '../contexts/InstituteContext';
import AttachmentPicker from '../components/AttachmentPicker';
import useAttachmentUploader from '../hooks/useAttachmentUploader';
import SelectInput from '../components/SelectInput';

dayjs.extend(localizedFormat);

const submissionTypeOptions: Array<{
  label: string,
  value: AssignmentSubmissionType,
}> = [
  {
    label: 'Image',
    value: 'image',
  }, {
    label: 'Audio',
    value: 'audio',
  }, {
    label: 'Video',
    value: 'video',
  }, {
    label: 'PDF',
    value: 'pdf',
  }, {
    label: 'Any file type',
    value: 'other',
  }, {
    label: 'Inline text reply',
    value: 'text-only',
  },
];

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

function NewAssignment({ route, navigation }: Props) {
  const now = useMemo(() => new Date(), []);
  const [file, setFile] = useState<DocumentPickerResult | null>(null);
  const [attachmentType, setAttachmentType] = useState<AttachmentType | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [submissionType, setSubmissionType] = useState<AssignmentSubmissionType>('other');
  const [deadline, setDeadline] = useState<Date>(now);
  const [deadlinePickerVisible, setDeadlinePickerVisible] = useState<boolean>(false);
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

  const saveAssignment = useCallback(async () => {
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
      const assignmentRef = firestore().collection('assignments').doc();

      let attachment: Attachment | null = null;
      if (file && attachmentType) {
        attachment = await upload({
          docId: assignmentRef.id,
          collection: 'assignments',
          file,
          attachmentType,
          onProgressMessage: title,
        });
      }

      const assignment: $Diff<Assignment, { id: string }> = {
        title,
        description,
        course: courseId,
        teacher: activeAccount.id,
        institute: activeAccount.institute,
        status: attachment ? 'uploading' : 'available',
        // $FlowFixMe prop of type JavaScript Date is automatically converted to firebase TimeStamp
        deadline,
        submissionType,
        createdAt: firestore.FieldValue.serverTimestamp(),
      };

      if (attachment) {
        if (attachment.type === 'audio' && duration) {
          attachment.duration = duration;
        }
        assignment.attachment = attachment;
      }

      await assignmentRef.set(assignment);

      navigation.goBack();
    } catch (error) {
      setSending(false);
      Alert.alert(
        'Oops!',
        'Something went wrong while uploading this assignment.'
          + ` Please try again or contact your ${institute?.type || 'institute'} if the issue persists.`,
        [
          { text: 'OK', style: 'cancel' },
          { text: 'Retry', onPress: saveAssignment },
        ],
      );

      if (__DEV__) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    }
  // eslint-disable-next-line max-len
  }, [institute, courseId, title, activeAccount, file, attachmentType, description, deadline, submissionType, navigation, upload, duration]);

  useLayoutEffect(() => {
    const course = courses.find((c) => c.id === courseId);
    navigation.setOptions({
      headerRight: (
        <Button
          onPress={saveAssignment}
          style={styles.sendButton}
          loading={sending}
        >
          Send
        </Button>
      ),
      subtitle: course?.name,
    });
  }, [courseId, courses, navigation, saveAssignment, sending, theme.colors.onSurface]);

  const toggleDeadlineTimePicker = useCallback(() => {
    setDeadlinePickerVisible((visible) => !visible);
  }, []);

  const handleDeadlineConfirm = useCallback((date: Date) => {
    setDeadlinePickerVisible(false);
    setDeadline(date);
  }, []);

  const handleSubmissionTypeSelect = useCallback((type: any) => {
    setSubmissionType((type));
  }, []);

  const renderFromInputText = useCallback((props: { style: any, value: string }) => {
    const { style, value } = props;

    return (
      <TouchableRipple onPress={toggleDeadlineTimePicker}>
        <Text style={style}>{value}</Text>
      </TouchableRipple>
    );
  }, [toggleDeadlineTimePicker]);

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

      <SelectInput
        label="Students are required to submit:"
        options={submissionTypeOptions}
        selection={submissionType}
        style={styles.textInput}
        onSelect={handleSubmissionTypeSelect}
      />

      <TextInput
        label="Deadline"
        mode="outlined"
        value={dayjs(deadline).format('lll')}
        style={styles.textInput}
        render={renderFromInputText}
      />

      <DateTimePickerModal
        mode="datetime"
        date={deadline}
        headerTextIOS="Pick a date & time"
        isVisible={deadlinePickerVisible}
        onConfirm={handleDeadlineConfirm}
        onCancel={toggleDeadlineTimePicker}
      />
    </ScrollView>
  );
}

export default NewAssignment;
