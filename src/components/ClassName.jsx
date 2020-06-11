// @flow
import { useMemo } from 'react';
import firestore from '@react-native-firebase/firestore';

import type { InstituteClass } from '../types';
import useDoc from '../hooks/useDoc';

type Props = {
  id: string,
  prefix?: string,
  suffix?: string,
}

function ClassName({ id, prefix = '', suffix = '' }: Props) {
  const ref = useMemo(() => firestore().collection('classes').doc(id), [id]);

  const { data: instituteClass } = useDoc<InstituteClass>(ref);

  return instituteClass ? `${prefix}${instituteClass.name}${suffix}` : null;
}

export default ClassName;
