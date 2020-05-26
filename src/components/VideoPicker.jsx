// @flow
import React, { useCallback, useEffect } from 'react';
import { Button, Card } from 'react-native-paper';
import DocumentPicker from 'react-native-document-picker';
import { StyleSheet } from 'react-native';

import type { DocumentPickerResult } from '../types';
import VideoPlayer from './VideoPlayer';
import config from '../config';

const styles = StyleSheet.create({
  pickerButton: {
    padding: config.values.space.small,
  },
});

type Props = {
  video: DocumentPickerResult | null,
  onChange: (video: DocumentPickerResult | null) => void,
}

function VideoPicker({ video, onChange }: Props) {
  const openPicker = useCallback(async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.video],
      });
      onChange(res);
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
        return;
      }

      console.error(error);
    }
  }, [onChange]);

  useEffect(() => {
    if (!video) {
      openPicker();
    }
  }, [video, openPicker]);

  if (!video) {
    return (
      <Button
        mode="outlined"
        icon="video-plus"
        uppercase={false}
        labelStyle={styles.pickerButton}
        onPress={openPicker}
      >
        Select a video
      </Button>
    );
  }

  return (
    <Card style={{ overflow: 'hidden' }}>
      <VideoPlayer uri={video.uri} />
      <Card.Actions>
        <Button onPress={openPicker}>Change video</Button>
      </Card.Actions>
    </Card>
  );
}

export default VideoPicker;
