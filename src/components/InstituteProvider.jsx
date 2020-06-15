// @flow
import * as React from 'react';
import firestore from '@react-native-firebase/firestore';

import type { Institute, Course, Klass } from '../types';
import InstituteContext from '../contexts/InstituteContext';
import useDoc from '../hooks/useDoc';
import FullScreenActivityIndicator from './FullScreenActivityIndicator';
import useDocsQuery from '../hooks/useDocsQuery';

type Props = {
  children: React.Node,
  instituteId?: string,
};

function InstituteProvider({ children, instituteId = null }: Props) {
  const instituteRef = React.useMemo(() => instituteId && firestore().collection('institute-data').doc(instituteId), [instituteId]);

  const {
    loading,
    loadingError,
    isOffline,
    exists,
    data: institute,
  } = useDoc<Institute>(instituteRef);

  const coursesQuery = React.useMemo(() => {
    if (!institute) {
      return null;
    }

    return firestore().collection('courses')
      .where('institute', '==', institute.id)
      .orderBy('createdAt', 'desc');
  }, [institute]);

  const classesQuery = React.useMemo(() => {
    if (!institute) {
      return null;
    }

    return firestore().collection('classes')
      .where('institute', '==', institute.id)
      .orderBy('createdAt', 'desc');
  }, [institute]);

  const {
    loading: coursesLoading,
    loadingError: coursesLoadingError,
    isOffline: coursesIsOffline,
    docs: courses = [],
  } = useDocsQuery<Course>(coursesQuery);

  const {
    loading: classesLoading,
    loadingError: classesLoadingError,
    isOffline: classesIsOffline,
    docs: classes = [],
  } = useDocsQuery<Klass>(classesQuery);

  const value = {
    loading: loading || coursesLoading,
    loadingError: loadingError || coursesLoadingError || classesLoadingError,
    isOffline: isOffline || coursesIsOffline || classesIsOffline,
    isSetupPending: !exists,
    institute,
    courses,
    classes,
    instituteRef,
  };

  if (loading || (institute && (coursesLoading || classesLoading))) {
    return <FullScreenActivityIndicator />;
  }

  return (
    <>
      <InstituteContext.Provider value={value}>
        {children}
      </InstituteContext.Provider>
    </>
  );
}

export default InstituteProvider;
