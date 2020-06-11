// @flow
import React, { useMemo, useCallback } from 'react';
import SelectInput from './SelectInput';

import type { Account } from '../types';
import useInstituteClasses from '../hooks/useInstituteClasses';
import { asTeacher } from '../utils';

type Props = {
  account: Account | null,
  classId: string | null,
  onChange: (id: string) => void,
}

function ClassPicker({
  classId,
  account,
  onChange,
}: Props) {
  const { classes } = useInstituteClasses(account);

  const handleChange = useCallback((selection: string) => {
    onChange(selection);
  }, [onChange]);

  const classOptions: Array<{ label: string, value: string }> = useMemo(() => {
    if (!account || !account.classes) {
      return [];
    }

    const teacher = asTeacher(account);
    if (!teacher) {
      return [];
    }

    const classIds = new Set();
    teacher.classes.forEach(({ id }) => {
      classIds.add(id);
    });

    const teacherClasses = Array.from(classIds).map((id) => {
      const cs = classes.find((c) => c.id === id);
      if (!cs) {
        return null;
      }
      return { id, name: cs.name };
    }).filter(Boolean);

    return teacherClasses.map((cs) => ({
      label: cs.name,
      value: cs.id,
    }));
  }, [account, classes]);

  return (
    <SelectInput
      label="Class"
      selection={classId}
      options={classOptions}
      onSelect={handleChange}
    />
  );
}

export default ClassPicker;
