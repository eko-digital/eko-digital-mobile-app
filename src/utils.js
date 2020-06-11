// @flow
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/functions';
import DeviceInfo from 'react-native-device-info';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';

import type {
  Account,
  Teacher,
  Student,
  InstituteClass,
  TeacherClassSubject,
} from './types';

const defaultApp = firebase.app();
const functionsForMumbaiRegion = defaultApp.functions('asia-east2');

export async function getCallableFunction(name: string) {
  const isEmulator = await DeviceInfo.isEmulator();
  if (isEmulator) {
    functionsForMumbaiRegion.useFunctionsEmulator('http://10.0.2.2:5000');
  }
  return functionsForMumbaiRegion.httpsCallable(name);
}

export function getInitials(name: string) {
  const nameParts = name.split(' ');

  if (nameParts.length > 1) {
    const firstName = nameParts[0];
    const lastName = nameParts[nameParts.length - 1];
    return `${firstName[0]}${lastName[0]}`;
  }

  return name.slice(0, 2).toUpperCase();
}

export function asTeacher(account: Account | null): Teacher | null {
  return account && account.classes ? account : null;
}

export function asStudent(account: Account | null): Student | null {
  return account && account.class ? account : null;
}

export function getTeacherClassSubjects(
  teacher: Teacher | null,
  classes: InstituteClass[],
): TeacherClassSubject[] {
  if (teacher && classes) {
    return teacher.classes.map((tClass) => {
      const currentClass = classes.find((c) => c.id === tClass.id);
      if (currentClass) {
        return {
          id: currentClass.id,
          name: currentClass.name,
          subject: tClass.subject,
        };
      }
      return null;
    }).filter(Boolean);
  }
  return [];
}

export function getAttachmentPath(
  user: FirebaseAuthTypes.User,
  account: Account,
  collection: 'lessons' | 'assignments',
  docId: string,
) {
  return `users/${user.uid}/teachers/${account.id}/${collection}/${docId}`;
}

export function capitalize(str: string) {
  if (typeof str !== 'string') {
    return '';
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
}
