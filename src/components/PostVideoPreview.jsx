// @flow
import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import {
  ActivityIndicator,
  Card,
  Paragraph,
  TouchableRipple,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Upload from 'react-native-background-upload';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import type { Post } from '../types';
import config from '../config';

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
  post: Post,
}

function PostVideoPreview({ post }: Props) {
  const [uploadError, setUploadError] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const { navigate } = useNavigation();

  useEffect(() => {
    const progressEventSubscription = Upload.addListener('progress', post.id, (data) => {
      setUploadProgress(data.progress);
    });

    const errorEventSubscription = Upload.addListener('error', post.id, (error) => {
      console.error('Video upload error', error);
      setUploadError(true);
      setUploadProgress(null);
    });

    const completedEventSubscription = Upload.addListener('completed', post.id, () => {
      setUploadProgress(null);
    });

    return () => {
      progressEventSubscription.remove();
      errorEventSubscription.remove();
      completedEventSubscription.remove();
    };
  }, [post.id]);

  const playVideo = useCallback(() => {
    navigate('VideoScreen', { post });
  }, [post, navigate]);

  let content = null;
  if (post.status === 'processing-error' || uploadError) {
    content = (
      <View style={[StyleSheet.absoluteFill, styles.overlay]}>
        <MaterialCommunityIcons
          name="alert-outline"
          color="#fff"
          size={36}
        />
        <Paragraph style={[styles.text, styles.errorText]}>
          Something went wrong while processing this video.
          Please delete it and upload a new one.
        </Paragraph>
      </View>
    );
  } else if (post.status === 'uploading') {
    content = (
      <View style={[StyleSheet.absoluteFill, styles.overlay]}>
        <ActivityIndicator color="#fff" />
        {uploadProgress ? (
          <Paragraph style={[styles.text, styles.loadingText]}>{`Uploading video (${uploadProgress}%)`}</Paragraph>
        ) : (
          <Paragraph style={[styles.text, styles.loadingText]}>Processing video...</Paragraph>
        )}
      </View>
    );
  } else if (post.status === 'available') {
    content = (
      <TouchableRipple
        style={[StyleSheet.absoluteFill, styles.overlay]}
        onPress={playVideo}
        rippleColor="rgba(255, 255, 255, 0.2)"
      >
        <View style={styles.play}>
          <MaterialCommunityIcons
            name="play"
            color="#000"
            size={36}
          />
        </View>
      </TouchableRipple>
    );
  }

  const thumbnail = `https://videodelivery.net/${post.videoToken || post.videoId || ''}/thumbnails/thumbnail.jpg?time=1s`;

  return (
    <View style={styles.container}>
      {content}
      <Card.Cover source={{ uri: thumbnail }} style={styles.cover} />
    </View>
  );
}

export default PostVideoPreview;
