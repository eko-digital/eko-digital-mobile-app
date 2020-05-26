// @flow
import React, { useCallback, useEffect } from 'react';
import { Button, Card } from 'react-native-paper';
import DocumentPicker from 'react-native-document-picker';
import { StyleSheet } from 'react-native';

import type { DocumentPickerResult } from '../types';
import config from '../config';

const styles = StyleSheet.create({
  pickerButton: {
    padding: config.values.space.small,
  },
});

type Props = {
  image: DocumentPickerResult | null,
  onChange: (image: DocumentPickerResult) => void,
}

function ImagePicker({ image, onChange }: Props) {
  const openPicker = useCallback(async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
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
    if (!image) {
      openPicker();
    }
  }, [image, openPicker]);

  if (!image) {
    return (
      <Button
        mode="outlined"
        icon="image-plus"
        uppercase={false}
        labelStyle={styles.pickerButton}
        onPress={openPicker}
      >
        Select an image
      </Button>
    );
  }

  return (
    <Card>
      <Card.Cover source={{ uri: image.uri }} />
      <Card.Actions>
        <Button onPress={openPicker}>Change Image</Button>
      </Card.Actions>
    </Card>
  );
}

export default ImagePicker;
