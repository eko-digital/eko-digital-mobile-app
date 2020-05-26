// @flow
import React, { useState, useMemo, useCallback } from 'react';
import SelectInput from './SelectInput';

import type { Account, TeacherClassSubject } from '../types';
import useSchoolClasses from '../hooks/useSchoolClasses';
import { asTeacher, getTeacherClassSubjects } from '../utils';

type Props = {
  account: Account | null,
  onClassIdChange: (classId: string) => void,
  onSubjectChange: (subject: string | null) => void,
}

function ClassSubjectPicker({
  account,
  onClassIdChange,
  onSubjectChange,
}: Props) {
  const [classSubject, setClassSubject] = useState<string | null>(null);

  const { classes } = useSchoolClasses(account);

  const handleChange = useCallback((selection: string) => {
    setClassSubject(selection);

    const classSubjectObj: TeacherClassSubject = JSON.parse(selection);
    onClassIdChange(classSubjectObj.id);
    onSubjectChange(classSubjectObj.subject || null);
  }, [onClassIdChange, onSubjectChange]);

  const subjectOptions: Array<{ label: string, value: string }> = useMemo(() => {
    if (!account || !account.classes) {
      return [];
    }

    const teacher = asTeacher(account);
    const classSubjects = getTeacherClassSubjects(teacher, classes);

    return classSubjects.map((cs) => ({
      label: cs.subject ? `${cs.name}: ${cs.subject}` : cs.name,
      value: JSON.stringify(cs),
    }));
  }, [account, classes]);

  return (
    <SelectInput
      label="Class/Subject"
      selection={classSubject}
      options={subjectOptions}
      onSelect={handleChange}
    />
  );
}

export default ClassSubjectPicker;
