// @flow
import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Subheading, useTheme, ToggleButton, Button, Card, Divider,
} from 'react-native-paper';
import DocumentPicker from 'react-native-document-picker';

import type { AttachmentType, DocumentPickerResult } from '../types';
import config from '../config';
import VideoPlayer from './VideoPlayer';
import AudioPlayer from './AudioPlayer';
import FilePreview from './FilePreview';
import AccountContext from '../contexts/AccountContext';

const styles = StyleSheet.create({
  button: {
    marginTop: config.values.space.normal,
    padding: config.values.space.extraSmall,
  },
  previewCard: {
    marginTop: config.values.space.normal,
    overflow: 'hidden',
  },
});

export const allAttachmentTypes = ['video', 'audio', 'image', 'pdf', 'other'];
export const nonAVAttachmentTypes = ['image', 'pdf', 'other'];

type Props = {|
  style?: any,
  allowedTypes?: AttachmentType[],
  onChange: (
    attachment: DocumentPickerResult | null,
    type: AttachmentType | null,
  ) => void,
  onDuration?: (duration: number | null) => void,
|}

function AttachmentPicker({
  style,
  allowedTypes = allAttachmentTypes,
  onChange,
  onDuration = null,
}: Props) {
  const [type, setType] = React.useState<AttachmentType | null>(
    allowedTypes.length === 1 ? allowedTypes[0] : null,
  );
  const [loading, setLoading] = React.useState<boolean>(false);
  const [attachment, setAttachment] = React.useState<DocumentPickerResult | null>(null);

  const { activeAccount } = React.useContext(AccountContext);
  const theme = useTheme();
  const typeLabel = React.useMemo(() => (type === 'other' ? 'file' : type || ''), [type]);

  const handleAudioReady = React.useCallback((duration) => {
    if (onDuration) {
      onDuration(duration);
    }
  }, [onDuration]);

  const handleTypeChange = React.useCallback((newType) => {
    setType(newType);
    setAttachment(null);
    onChange(null, null);
    if (onDuration) {
      onDuration(null);
    }
  }, [onChange, onDuration]);

  const openPicker = React.useCallback(async () => {
    let pickerType;
    switch (type) {
      case 'video':
        pickerType = DocumentPicker.types.video;
        break;

      case 'audio':
        pickerType = DocumentPicker.types.audio;
        break;

      case 'image':
        pickerType = DocumentPicker.types.images;
        break;

      case 'pdf':
        pickerType = DocumentPicker.types.pdf;
        break;

      default:
        pickerType = DocumentPicker.types.allFiles;
        break;
    }

    setLoading(true);

    try {
      const res = await DocumentPicker.pick({
        type: [pickerType],
      });

      setAttachment(res);
      onChange(res, type);
      if (onDuration) {
        onDuration(null);
      }
    } catch (error) {
      if (!DocumentPicker.isCancel(error)) {
        console.error(error);
      }
    }

    setLoading(false);
  }, [onChange, onDuration, type]);

  const resetAttachment = React.useCallback(() => {
    setType(null);
    setAttachment(null);
    onChange(null, null);
    if (onDuration) {
      onDuration(null);
    }
  }, [onChange, onDuration]);

  const toggleButtons: React.Node = React.useMemo(() => {
    if (allowedTypes.length === 1) {
      return null;
    }

    const buttons: Array<{ type: AttachmentType, button: React.Node }> = [
      { type: 'video', button: <ToggleButton key="video" icon="video-outline" value="video" /> },
      { type: 'audio', button: <ToggleButton key="audio" icon="headphones" value="audio" /> },
      { type: 'image', button: <ToggleButton key="image" icon="image-outline" value="image" /> },
      { type: 'pdf', button: <ToggleButton key="pdf" icon="file-pdf-outline" value="pdf" /> },
      { type: 'other', button: <ToggleButton key="other" icon="attachment" value="other" /> },
    ];

    return buttons
      .filter(({ type: t }) => allowedTypes.includes(t))
      .map(({ button }) => button);
  }, [allowedTypes]);

  return (
    <View style={style}>
      <Subheading
        style={{ ...theme.fonts.medium, marginBottom: 4 }}
      >
        Attachment
      </Subheading>

      {toggleButtons && (
        <ToggleButton.Row
          onValueChange={handleTypeChange}
          value={type}
        >
          {toggleButtons}
        </ToggleButton.Row>
      )}

      {type && !attachment && (
        <Button
          mode="contained"
          style={styles.button}
          onPress={openPicker}
          loading={loading}
        >
          {`Select ${typeLabel}`}
        </Button>
      )}

      {attachment && (
        <Card style={styles.previewCard}>
          {type === 'video' && <VideoPlayer uri={attachment.uri} />}
          {type === 'audio' && (
          <AudioPlayer
            key={attachment.uri}
            title={attachment.name}
            artist={activeAccount?.name || ''}
            id={attachment.uri}
            url={attachment.uri}
            onReady={handleAudioReady}
          />
          )}
          {type === 'image' && <Card.Cover source={{ uri: attachment.uri }} />}
          {type === 'pdf' && <FilePreview type="pdf" name={attachment.name} size={attachment.size} />}
          {type === 'other' && <FilePreview type="other" name={attachment.name} size={attachment.size} />}
          <Divider />
          <Card.Actions>
            <Button onPress={openPicker}>
              {`Change ${typeLabel}`}
            </Button>
            <Button onPress={resetAttachment}>
              Reset
            </Button>
          </Card.Actions>
        </Card>
      )}
    </View>
  );
}

export default AttachmentPicker;
