// @flow
import React, { useMemo } from 'react';
import firestore from '@react-native-firebase/firestore';
import { StyleSheet, View } from 'react-native';
import { Subheading } from 'react-native-paper';

import type { AssignmentSubmission, ForumUser } from '../types';
import DownloadableFileCard from './DownloadableFileCard';
import BodyText from './BodyText';
import config from '../config';
import useDoc from '../hooks/useDoc';

const styles = StyleSheet.create({
  container: {
    marginBottom: config.values.space.normal,
  },
  description: {
    marginTop: config.values.space.normal,
  },
});

type Props = {|
  submission: AssignmentSubmission,
|}

function AssignmentSubmissionView({ submission }: Props) {
  const { attachment } = submission;

  const docRef = useMemo(() => firestore().collection('forum-users').doc(submission.student), [submission.student]);
  const { data: student } = useDoc<ForumUser>(docRef);

  const attachmentPreview = attachment ? (
    <DownloadableFileCard
      type={attachment.type === 'pdf' ? 'pdf' : 'other'}
      name={attachment.name}
      size={attachment.size}
      uri={attachment.url}
      localFileName={`submission-${submission.id}-${attachment.name}`}
    />
  ) : null;

  return (
    <View style={styles.container}>
      {student ? <Subheading>{student.name}</Subheading> : null}
      {attachmentPreview}
      {submission.description ? (
        <BodyText
          style={styles.description}
        >
          {submission.description}
        </BodyText>
      ) : null}
    </View>
  );
}

export default AssignmentSubmissionView;
