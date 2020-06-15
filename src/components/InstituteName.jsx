// @flow
import { useMemo } from 'react';
import firestore from '@react-native-firebase/firestore';

import type { Institute } from '../types';
import useDoc from '../hooks/useDoc';

type Props = {
  instituteId: string,
}

function InstituteName({ instituteId }: Props) {
  const query = useMemo(() => firestore().collection('institute-data').doc(instituteId), [instituteId]);
  const { data: institute } = useDoc<Institute>(query);
  return institute?.name || '...';
}

export default InstituteName;
