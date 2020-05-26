// @flow
import React, { useCallback } from 'react';
import { Card, TouchableRipple } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

import type { Post } from '../types';

type Props = {
  post: Post,
}

function PostImagePreview({ post }: Props) {
  const { navigate } = useNavigation();

  const openImageInFullScreen = useCallback(() => {
    navigate('FullScreenImage', {
      uri: post.attachment,
      title: post.title,
    });
  }, [post.attachment, post.title, navigate]);

  return (
    <TouchableRipple
      onPress={openImageInFullScreen}
    >
      <Card.Cover source={{ uri: post.attachment }} />
    </TouchableRipple>
  );
}

export default PostImagePreview;
