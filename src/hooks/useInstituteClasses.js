// @flow
import firestore from '@react-native-firebase/firestore';

import { useMemo } from 'react';
import type { Account, InstituteClass } from '../types';
import useDocsQuery from './useDocsQuery';

type Response = {
  loading: boolean,
  classes: InstituteClass[],
}

function useInstituteClasses(account: Account | null): Response {
  const query = useMemo(() => (account
    ? firestore().collection('classes')
      .where('institute', '==', account.institute)
    : null), [account]);

  const { loading, docs: classes } = useDocsQuery<InstituteClass>(query);

  return { loading, classes };
}

export default useInstituteClasses;
