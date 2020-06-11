// @flow
export type FirestoreTimestamp = {
  _seconds: number,
}

export type InstituteType = 'school' | 'college' | 'university' | 'institute';

export type TeacherClassSubject = {
  id: string,
  name: string,
  subject: string,
}

export type Institute = {
  id: string,
  name: string,
  logo?: string,
  description?: string,
  email?: string,
  phoneNumber?: string,
  type: InstituteType,
}

export type InstituteClass = {|
  id: string,
  name: string,
  subjects: string[],
|};

export type Student = {|
  id: string,
  name: string,
  phoneNumber?: string,
  email?: string,
  institute: string,
  class: string,
  photoURL?: string,
  studentID?: string,
  father?: string,
  mother?: string,
  favoriteLessons?: string[],
  favoriteAssignments?: string[],
|};

export type Teacher = {|
  id: string,
  name: string,
  phoneNumber?: string,
  email?: string,
  institute: string,
  classes: Array<{
    id: string,
    subject: string,
  }>,
  photoURL?: string,
|};

export type Account = Student | Teacher;

export type DocumentPickerResult = {
  name: string,
  size: number,
  type: string,
  uri: string,
}

export type LessonFormat = 'video' | 'image' | 'pdf' | 'text';
export type AssignmentFormat = 'image' | 'pdf' | 'text';

export type Post = {|
  id: string,
  type: LessonFormat,
  title: string,
  description?: string,
  class: string,
  subject?: string,
  teacher: string,
  institute: string,
  attachment?: string,
  attachmentName?: string,
  attachmentSize?: number,
  videoId?: string,
  videoToken?: string,
  thumbnail?: string,
  duration?: number,
  status: 'uploading' | 'available' | 'processing-error',
  createdAt?: FirestoreTimestamp, // it's null during doc is saved in firestore
|}

export type PostType = 'lesson' | 'assignment';
export type PostFormat = LessonFormat | AssignmentFormat;

export type ForumTopic = {
  id: string,
  title: string,
  description: string,
  class: string,
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
