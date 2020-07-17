// @flow
import React, { useContext, useMemo, useCallback } from 'react';
import firestore from '@react-native-firebase/firestore';
import { FlatList } from 'react-native';
import { Caption } from 'react-native-paper';

import type { Assignment, AssignmentSubmission } from '../types';
import AccountContext from '../contexts/AccountContext';
import useDocsQuery from '../hooks/useDocsQuery';
import FullScreenActivityIndicator from './FullScreenActivityIndicator';
import ErrorScreen from './ErrorScreen';
import OfflineScreen from './OfflineScreen';
import AssignmentSubmissionView from './AssignmentSubmissionView';

type Props = {|
  assignment: Assignment,
|}

function AssignmentSubmissions({ assignment }: Props) {
  const { activeAccount } = useContext(AccountContext);

  const query = useMemo(() => {
    if (!activeAccount) {
      return null;
    }

    return firestore().collection('assignment-submissions')
      .where('assignment', '==', assignment.id)
      .orderBy('createdAt', 'desc');
  }, [activeAccount, assignment.id]);

  const {
    docs: submissions,
    loading,
    loadingError,
    isOffline,
    retry,
  } = useDocsQuery<AssignmentSubmission>(query);

  const renderItem = useCallback(({ item }) => (
    <AssignmentSubmissionView
      submission={item}
    />
  ), []);

  if (!activeAccount) {
    return null;
  }

  if (loading) {
    return <FullScreenActivityIndicator />;
  }

  if (isOffline && submissions.length === 0) {
    return <OfflineScreen onRetry={retry} />;
  }

  if (loadingError && submissions.length === 0) {
    return (
      <ErrorScreen
        description="Something went wrong while fetching submissions"
      />
    );
  }

  if (submissions.length === 0) {
    return (
      <Caption>No submissions yet!</Caption>
    );
  }

  return (
    <FlatList
      data={submissions}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
    />
  );
}

export default AssignmentSubmissions;
