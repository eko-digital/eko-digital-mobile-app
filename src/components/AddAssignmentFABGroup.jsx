// @flow
import React, { useCallback, useState } from 'react';
import { FAB } from 'react-native-paper';
import { useSafeArea } from 'react-native-safe-area-context';

import type { AssignmentType } from '../types';

type Props = {
  navigate: (route: string, options: { [key: string]: any }) => void,
};

function AddAssignmentFABGroup({ navigate }: Props) {
  const safeArea = useSafeArea();

  const [open, setOpen] = useState<boolean>(false);

  const handleStateChange = useCallback((state) => {
    setOpen(state.open);
  }, []);

  const navigateToNewAssignment = useCallback((assignmentType: AssignmentType) => {
    navigate('NewAssignment', {
      assignmentType,
    });
  }, [navigate]);

  return (
    <FAB.Group
      open={open}
      accessibilityLabel="Add new assignment"
      icon={open ? 'clipboard-text-outline' : 'plus'}
      actions={[
        { icon: 'image-outline', label: 'Image', onPress: () => navigateToNewAssignment('image') },
        { icon: 'file-pdf-outline', label: 'PDF', onPress: () => navigateToNewAssignment('pdf') },
        { icon: 'text-subject', label: 'Text only', onPress: () => navigateToNewAssignment('text') },
      ]}
      style={{
        paddingBottom: safeArea.bottom + 60,
      }}
      onStateChange={handleStateChange}
    />
  );
}

export default AddAssignmentFABGroup;
