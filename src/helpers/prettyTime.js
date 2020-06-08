// @flow
import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar';
import relativeTime from 'dayjs/plugin/relativeTime';
import isToday from 'dayjs/plugin/isToday';

import type { FirestoreTimestamp } from '../types';

dayjs.extend(calendar);
dayjs.extend(relativeTime);
dayjs.extend(isToday);

function prettyTime({ _seconds: seconds }: FirestoreTimestamp) {
  const dayjsDate = dayjs.unix(seconds);

  if (dayjsDate.isToday()) {
    return dayjsDate.fromNow();
  }

  return dayjs().calendar(dayjsDate, {
    sameDay: 'hh:mm a',
    nextDay: 'DD MMM',
    nextWeek: 'DD MMM',
    lastDay: 'DD MMM',
    lastWeek: 'DD MMM',
    sameElse: 'DD MMM',
  });
}

export default prettyTime;
