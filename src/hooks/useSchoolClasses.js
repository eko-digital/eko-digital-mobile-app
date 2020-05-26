// @flow
import firestore from '@react-native-firebase/firestore';

import { useMemo } from 'react';
import type { Account, SchoolClass } from '../types';
import useDocsQuery from './useDocsQuery';

type Response = {
  loading: boolean,
  classes: SchoolClass[],
}

function useSchoolClasses(account: Account | null): Response {
  const query = useMemo(() => (account
    ? firestore().collection('classes')
      .where('school', '==', account.school)
    : null), [account]);

  const { loading, docs: classes } = useDocsQuery<SchoolClass>(query);

  return { loading, classes };
}

export default useSchoolClasses;
