// @flow
import React, { useMemo } from 'react';

import { StyleSheet, View } from 'react-native';
import {
  ActivityIndicator, Paragraph, Card, useTheme,
} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import type { Lesson, Assignment } from '../../types';
import config from '../../config';

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  overlay: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  text: {
    color: '#fff',
  },
  loadingText: {
    marginTop: config.values.space.small,
  },
  errorText: {
    padding: config.values.space.normal,
    textAlign: 'center',
  },
  cover: {
    backgroundColor: '#000',
  },
  play: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 60 / 2,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
  },
});

type Props = {
  item: Lesson | Assignment,
  isError?: boolean,
  isUploading?: boolean,
  isProcessing?: boolean,
  uploadError?: boolean,
  uploadProgress?: number | null,
}

function AttachmentCover({
  item,
  isError = false,
  isUploading = false,
  isProcessing = false,
  uploadError = false,
  uploadProgress = null,
}: Props) {
  const theme = useTheme();

  const overlayStyle = useMemo(
    () => [StyleSheet.absoluteFill, styles.overlay, { backgroundColor: theme.colors.backdrop }],
    [theme.colors.backdrop],
  );

  const coverImage = useMemo(() => {
    if (!item.attachment) {
      return null;
    }

    if (item.attachment.type === 'video' && item.attachment.streamToken) {
      return `https://videodelivery.net/${item.attachment.streamToken}/thumbnails/thumbnail.jpg`;
    }

    if (item.attachment.type === 'image' && item.attachment.url) {
      return item.attachment.url;
    }

    return null;
  }, [item.attachment]);

  let content = null;
  if (isError) {
    content = (
      <View style={overlayStyle}>
        <MaterialCommunityIcons
          name="alert-outline"
          color="#fff"
          size={36}
        />
        <Paragraph style={[styles.text, styles.errorText]}>
          {`Something went wrong while ${uploadError ? 'uploading' : 'processing'} this ${item.attachment?.type || 'item'}.`}
          {' Please delete it and upload a new one.'}
        </Paragraph>
      </View>
    );
  } else if (isUploading) {
    content = (
      <View style={overlayStyle}>
        <ActivityIndicator color="#fff" />
        <Paragraph style={[styles.text, styles.loadingText]}>
          {`Uploading ${item.attachment?.type || 'item'} (${uploadProgress || 0}%)`}
        </Paragraph>
      </View>
    );
  } else if (isProcessing) {
    content = (
      <View style={overlayStyle}>
        <ActivityIndicator color="#fff" />
        <Paragraph style={[styles.text, styles.loadingText]}>
          {`Processing ${item.attachment?.type || 'item'}...`}
        </Paragraph>
      </View>
    );
  } else if (item.status === 'available' && item.attachment?.type === 'video') {
    content = (
      <View style={overlayStyle}>
        <View style={styles.play}>
          <MaterialCommunityIcons
            name="play"
            color="#000"
            size={36}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {content}
      <Card.Cover
        source={{ uri: coverImage }}
        style={styles.cover}
      />
    </View>
  );
}

export default AttachmentCover;
