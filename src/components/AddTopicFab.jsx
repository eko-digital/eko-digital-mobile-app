// @flow
import React, { useCallback } from 'react';
import { FAB } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { useSafeArea } from 'react-native-safe-area-context';

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

type Props = {
  navigate: (route: string, options?: { [key: string]: any }) => void,
};

function AddTopicFab({ navigate }: Props) {
  const safeArea = useSafeArea();

  const navigateToNewTopic = useCallback(() => {
    navigate('NewTopic');
  }, [navigate]);

  return (
    <FAB
      style={[styles.fab, {
        marginBottom: safeArea.bottom + 72,
      }]}
      label="New topic"
      icon="message"
      onPress={navigateToNewTopic}
    />
  );
}

export default AddTopicFab;
