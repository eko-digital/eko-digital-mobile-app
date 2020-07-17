// @flow
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/functions';
import DeviceInfo from 'react-native-device-info';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import localizedFormat from 'dayjs/plugin/localizedFormat';

import prettyBytes from 'pretty-bytes';
import type { Lesson, Assignment, WeekdaysShort } from './types';
import prettyTime from './helpers/prettyTime';

dayjs.extend(customParseFormat);
dayjs.extend(localizedFormat);

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

export function capitalize(str: string) {
  if (typeof str !== 'string') {
    return '';
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function secondsToHms(seconds: number): string {
  if (!seconds) {
    return '00:00';
  }

  const timeStr = new Date(seconds * 1000).toISOString();

  return seconds >= 60 * 60 // if duration is 60 minutes or longer
    ? timeStr.substr(11, 8) // then return hh:mm:ss
    : timeStr.substr(14, 5); // else return mm:ss
}

export function prettyWeekdaysSelection(
  selection: WeekdaysShort[],
  separator: string = ', ',
  singleLetter: boolean = false,
): string {
  const weekdaysOrder: {
    [key: WeekdaysShort]: number,
  } = {
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
    Sun: 7,
  };

  const sorted = selection.sort((a, b) => weekdaysOrder[a] - weekdaysOrder[b]);

  if (singleLetter) {
    return sorted.map((d) => d[0]).join(separator);
  }

  return sorted.join(separator);
}

export type GetItemMetaOptions = {
  item: Lesson | Assignment,
  isError?: boolean,
  isUploading?: boolean,
  uploadError?: boolean,
  isProcessing?: boolean,
  uploadProgress?: number | null,
}

export function getItemMeta({
  item,
  isError = false,
  isUploading = false,
  uploadError = false,
  isProcessing = false,
  uploadProgress = null,
}: GetItemMetaOptions): string[] {
  let meta = [];
  if (isError) {
    meta = [
      `Something went wrong while ${uploadError ? 'uploading' : 'processing'} this ${item.attachment?.type || 'item'}.`
      + ' Please delete it and upload a new one.',
    ];
  } else if (isUploading) {
    meta = [`Uploading (${uploadProgress || 0}%)`];
  } else if (isProcessing) {
    meta = ['Processing...'];
  } else if (item.type === 'live') {
    const lesson: Lesson = (item: any);
    if (lesson.repeating && lesson.repeatsOn) {
      meta.push(prettyWeekdaysSelection((lesson.repeatsOn: any)));
    }
    if (lesson.from) {
      // eslint-disable-next-line no-underscore-dangle
      meta.push(dayjs.unix(lesson.from._seconds).format(lesson.repeating ? 'LT' : 'lll'));
    }
  } else {
    if (item.createdAt) {
      meta.push(prettyTime(item.createdAt));
    }
    if (item.attachment?.duration) {
      meta.push(secondsToHms(item.attachment?.duration || 0));
    } else if (item.attachment?.size) {
      meta.push(prettyBytes(item.attachment?.size || 0));
    }
    if (item.deadline) {
      const assignment: Assignment = (item: any);
      if (assignment.deadline) {
        meta.push(`Deadline: ${prettyTime(assignment.deadline)}`);
      }
    }
  }
  return meta;
}
