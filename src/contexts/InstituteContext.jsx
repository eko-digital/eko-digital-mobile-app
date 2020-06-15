// @flow
import React from 'react';
import firestore from '@react-native-firebase/firestore';

import type { Institute, Course, Klass } from '../types';

type ValueType = {
  loading: boolean,
  loadingError: boolean,
  isOffline: boolean,
  isSetupPending: boolean,
  institute: Institute | null,
  classes: Klass[],
  courses: Course[],
  instituteRef: firestore.DocumentReference<firestore.DocumentData> | null,
};

const InstituteContext = React.createContext<ValueType>({
  loading: true,
  loadingError: false,
  isOffline: false,
  isSetupPending: false,
  institute: null,
  classes: [],
  courses: [],
  instituteRef: null,
});

export default InstituteContext;
