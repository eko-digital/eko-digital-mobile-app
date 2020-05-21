// @flow

type Subject = {
  classId: string,
  className: string,
  name: string,
}

type School = {
  id: string,
  name: string,
  logo?: string,
  description?: string,
  email?: string,
  phoneNumber?: string,
}

export type Account = {
  id: string,
  name: string,
  photoURL: string | null,
  school: School,
  class?: { id: string, name: string }, // available for students only
  subjects?: Subject[], // available for teachers only
  isTeacher: boolean,
}

export type DocumentPickerResult = {
  name: string,
  size: number,
  type: string,
  uri: string,
}

export type LessonType = 'video' | 'image' | 'pdf' | 'text';
export type AssignmentType = 'image' | 'pdf' | 'text';
