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
  View,
  Alert,
  Keyboard,
} from 'react-native';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { TextInput, Button, Subheading } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

import type {
  DocumentPickerResult,
  Assignment,
  AssignmentSubmission,
  Attachment,
  AttachmentType,
} from '../types';
import AccountContext from '../contexts/AccountContext';
import { capitalize } from '../utils';
import config from '../config';
import InstituteContext from '../contexts/InstituteContext';
import AttachmentPicker from './AttachmentPicker';
import useAttachmentUploader from '../hooks/useAttachmentUploader';
import useDocsQuery from '../hooks/useDocsQuery';
import ErrorScreen from './ErrorScreen';
import OfflineScreen from './OfflineScreen';
import FullScreenActivityIndicator from './FullScreenActivityIndicator';
import AssignmentSubmissionView from './AssignmentSubmissionView';

dayjs.extend(localizedFormat);

const styles = StyleSheet.create({
  container: {
    marginBottom: config.values.space.large,
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
  submissionHeading: {
    marginTop: config.values.space.normal,
    marginBottom: config.values.space.small,
  },
});

type Props = {
  assignment: Assignment,
}

function AssignmentSubmissionForm({ assignment }: Props) {
  const [file, setFile] = useState<DocumentPickerResult | null>(null);
  const [attachmentType, setAttachmentType] = useState<AttachmentType | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [description, setDescription] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const { activeAccount } = useContext(AccountContext);
  const { institute } = useContext(InstituteContext);

  const navigation = useNavigation();
  const { upload } = useAttachmentUploader();

  const query = useMemo(() => {
    if (!activeAccount) {
      return null;
    }

    return firestore().collection('assignment-submissions')
      .where('assignment', '==', assignment.id)
      .where('student', '==', activeAccount.id)
      .limit(1);
  }, [activeAccount, assignment.id]);

  const {
    docs: submissions,
    loading,
    loadingError,
    isOffline,
    retry,
  } = useDocsQuery<AssignmentSubmission>(query);

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

    if (!assignment) {
      Alert.alert(
        '',
        `${capitalize(institute.i18n.courseSingular)} is required.`,
        [{ text: 'OK' }],
      );
      return;
    }

    if (assignment.submissionType !== 'text-only' && !file) {
      Alert.alert(
        '',
        'Attachment is required.',
        [{ text: 'OK' }],
      );
      return;
    }

    if (assignment.submissionType === 'text-only' && !description) {
      Alert.alert(
        '',
        'Description is required.',
        [{ text: 'OK' }],
      );
      return;
    }

    const { currentUser } = auth();

    if (!activeAccount || !currentUser) {
      return;
    }

    setSubmitting(true);

    try {
      const submissionRef = firestore().collection('assignment-submissions').doc();

      let attachment: Attachment | null = null;
      if (file && attachmentType) {
        attachment = await upload({
          docId: submissionRef.id,
          collection: 'assignment-submissions',
          file,
          attachmentType,
          onProgressMessage: assignment.title,
        });
      }

      const submissionData: $Diff<AssignmentSubmission, { id: string }> = {
        description,
        assignment: assignment.id,
        student: activeAccount.id,
        institute: activeAccount.institute,
        status: attachment ? 'uploading' : 'available',
        createdAt: firestore.FieldValue.serverTimestamp(),
      };

      if (attachment) {
        if (attachment.type === 'audio' && duration) {
          attachment.duration = duration;
        }
        submissionData.attachment = attachment;
      }

      await submissionRef.set(submissionData);
    } catch (error) {
      setSubmitting(false);
      Alert.alert(
        'Oops!',
        'Something went wrong while submitting your assignment.'
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
  }, [institute, assignment, activeAccount, file, attachmentType, description, upload, duration]);

  useLayoutEffect(() => {
    if (loading || loadingError || isOffline || submissions.length === 1) {
      return;
    }

    navigation.setOptions({
      headerRight: (
        <Button
          onPress={saveAssignment}
          style={styles.sendButton}
          loading={submitting}
        >
          Submit
        </Button>
      ),
    });
  // eslint-disable-next-line max-len
  }, [isOffline, loading, loadingError, navigation, saveAssignment, submissions.length, submitting]);

  if (loading) {
    return <FullScreenActivityIndicator />;
  }

  if (isOffline && submissions.length === 0) {
    return <OfflineScreen onRetry={retry} />;
  }

  if (loadingError && submissions.length === 0) {
    return (
      <ErrorScreen
        description="Something went wrong while fetching submission status."
      />
    );
  }

  if (submissions.length === 1 && !submitting) {
    return (
      <>
        <Subheading style={styles.submissionHeading}>Your submission</Subheading>
        <AssignmentSubmissionView
          submission={submissions[0]}
        />
      </>
    );
  }

  return (
    <View style={styles.container}>
      <Subheading style={styles.submissionHeading}>Submit assignment</Subheading>

      {assignment.submissionType !== 'text-only' ? (
        <AttachmentPicker
          style={styles.attachmentPicker}
          allowedTypes={[assignment.submissionType]}
          onChange={handlePickerChange}
          onDuration={setDuration}
        />
      ) : null}

      <TextInput
        label={assignment.submissionType === 'text-only' ? 'Description' : 'Description (optional)'}
        mode="outlined"
        multiline
        numberOfLines={8}
        value={description}
        style={styles.textInput}
        onChangeText={setDescription}
      />
    </View>
  );
}

export default AssignmentSubmissionForm;
