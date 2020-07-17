// @flow
export type FirestoreTimestamp = {
  _seconds: number,
}

export type ColorScheme = 'light' | 'dark' | 'system-default';

export type WeekdaysShort = 'Sun' | 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat';

export type InstituteType = 'school' | 'college' | 'university' | 'institute';

export type Institute = {|
  id: string,
  name: string,
  logo?: string,
  description?: string,
  email: string,
  phoneNumber?: string,
  type: InstituteType,
  i18n: {
    classSingular: string,
    classPlural: string,
    courseSingular: string,
    coursePlural: string,
  },
|};

export type Klass = {|
  id: string,
  name: string,
  institute: string,
  createdAt: FirestoreTimestamp,
|};

export type Course = {|
  id: string,
  name: string,
  description?: string,
  thumbnail?: string | null,
  class: string,
  institute: string,
  lessonCount: number,
  createdAt: FirestoreTimestamp,
|};

export type Student = {|
  id: string,
  name: string,
  phoneNumber?: string,
  email?: string,
  institute: string,
  class: string,
  courses?: string[],
  photoURL?: string,
  studentID?: string,
  father?: string,
  mother?: string,
  bookmarkedLessons?: string[],
  bookmarkedAssignments?: string[],
  isTeacher: false,
|};

export type Teacher = {|
  id: string,
  name: string,
  phoneNumber?: string,
  email?: string,
  institute: string,
  courses?: string[],
  photoURL?: string,
  isTeacher: true,
|};

export type Account = Student | Teacher;

export type DocumentPickerResult = {
  name: string,
  size: number,
  type: string,
  uri: string,
}

export type LessonType = 'live' | 'upload';
export type AttachmentType = 'video' | 'audio' | 'image' | 'pdf' | 'other';
export type AssignmentSubmissionType = AttachmentType | 'text-only';
export type CourseItemType = 'lesson' | 'assignment';
export type CourseItemStatus = 'uploading' | 'available' | 'processing' | 'processing-error';

export type Attachment = {|
  type: AttachmentType,
  url: string,
  name: string,
  size: number,
  streamID?: string, // for video attachments only
  streamToken?: string, // for video attachments only
  duration?: number, // for audio/video attachments only
  mimeType: string,
|}

export type Lesson = {|
  id: string,
  type: LessonType,
  title: string,
  description?: string,
  course?: string,
  teacher: string,
  institute: string,
  attachment?: Attachment,
  status: CourseItemStatus,
  repeating?: boolean, // for live classes only
  repeatsOn?: WeekdaysShort[], // for live classes only
  from?: FirestoreTimestamp, // for live classes only
  to?: FirestoreTimestamp, // for live classes only
  live?: boolean, // for live classes only
  createdAt?: FirestoreTimestamp, // it's null during doc is saved in firestore
|}

export type Assignment = {|
  id: string,
  title: string,
  description?: string,
  course?: string,
  teacher: string,
  institute: string,
  attachment?: Attachment,
  status: CourseItemStatus,
  submissionType: AssignmentSubmissionType,
  deadline?: FirestoreTimestamp,
  createdAt?: FirestoreTimestamp, // it's null during doc is saved in firestore
|}

export type AssignmentSubmission = {|
  id: string,
  description?: string,
  assignment?: string,
  student: string,
  institute: string,
  attachment?: Attachment,
  status: CourseItemStatus,
  createdAt?: FirestoreTimestamp, // it's null during doc is saved in firestore
|}

export type ForumTopic = {
  id: string,
  title: string,
  description: string,
  course?: string,
  author: string,
  replyCount: number,
  createdAt?: FirestoreTimestamp, // it's null during doc is saved in firestore
}

export type ForumReply = {
  id: string,
  description: string,
  topic: string,
  author: string,
  createdAt?: FirestoreTimestamp, // it's null during doc is saved in firestore
}

export type ForumUser = {
  id: string,
  name: string,
  photoURL: string,
  isTeacher: boolean,
}
