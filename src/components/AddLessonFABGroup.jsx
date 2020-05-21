// @flow
import React, { useCallback, useState } from 'react';
import { FAB } from 'react-native-paper';
import { useSafeArea } from 'react-native-safe-area-context';

import type { LessonType } from '../types';

type Props = {
  navigate: (route: string, options: { [key: string]: any }) => void,
};

function AddLessonFABGroup({ navigate }: Props) {
  const safeArea = useSafeArea();

  const [open, setOpen] = useState<boolean>(false);

  const handleStateChange = useCallback((state) => {
    setOpen(state.open);
  }, []);

  const navigateToNewLesson = useCallback((lessonType: LessonType) => {
    navigate('NewLesson', {
      lessonType,
    });
  }, [navigate]);

  return (
    <FAB.Group
      open={open}
      accessibilityLabel="Add new lesson"
      icon={open ? 'teach' : 'plus'}
      actions={[
        { icon: 'video-outline', label: 'Video', onPress: () => navigateToNewLesson('video') },
        { icon: 'image-outline', label: 'Image', onPress: () => navigateToNewLesson('image') },
        { icon: 'file-pdf-outline', label: 'PDF', onPress: () => navigateToNewLesson('pdf') },
        { icon: 'text-subject', label: 'Text only', onPress: () => navigateToNewLesson('text') },
      ]}
      style={{
        paddingBottom: safeArea.bottom + 60,
      }}
      onStateChange={handleStateChange}
    />
  );
}

export default AddLessonFABGroup;
