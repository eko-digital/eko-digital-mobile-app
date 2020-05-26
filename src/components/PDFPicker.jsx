// @flow
import React, { useCallback, useEffect } from 'react';
import { Button, useTheme, Card } from 'react-native-paper';
import DocumentPicker from 'react-native-document-picker';
import { StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import prettyBytes from 'pretty-bytes';

import type { DocumentPickerResult } from '../types';
import config from '../config';

const styles = StyleSheet.create({
  pickerButton: {
    padding: config.values.space.small,
  },
});

type Props = {
  pdf: DocumentPickerResult | null,
  onChange: (pdf: DocumentPickerResult | null) => void,
}

function PDFPicker({ pdf, onChange }: Props) {
  const theme = useTheme();

  const openPicker = useCallback(async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
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
    if (!pdf) {
      openPicker();
    }
  }, [pdf, openPicker]);

  const pdfIcon = useCallback(() => (
    <MaterialCommunityIcons
      name="pdf-box"
      color={theme.colors.notification}
      size={48}
    />
  ), [theme]);

  if (!pdf) {
    return (
      <Button
        mode="outlined"
        icon="pdf-box"
        uppercase={false}
        labelStyle={styles.pickerButton}
        onPress={openPicker}
      >
        Select a PDF file
      </Button>
    );
  }

  return (
    <Card>
      <Card.Title title={pdf.name} subtitle={prettyBytes(pdf.size)} left={pdfIcon} />
      <Card.Actions>
        <Button onPress={openPicker}>Change file</Button>
      </Card.Actions>
    </Card>
  );
}

export default PDFPicker;
