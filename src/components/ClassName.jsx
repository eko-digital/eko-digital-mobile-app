// @flow
import { useMemo } from 'react';
import firestore from '@react-native-firebase/firestore';

import type { SchoolClass } from '../types';
import useDoc from '../hooks/useDoc';

type Props = {
  id: string,
  prefix?: string,
  suffix?: string,
}

function ClassName({ id, prefix = '', suffix = '' }: Props) {
  const ref = useMemo(() => firestore().collection('classes').doc(id), [id]);

  const { data: schoolClass } = useDoc<SchoolClass>(ref);

  return schoolClass ? `${prefix}${schoolClass.name}${suffix}` : null;
}

export default ClassName;
