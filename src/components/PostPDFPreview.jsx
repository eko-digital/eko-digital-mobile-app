// @flow
import React, { useCallback } from 'react';
import prettyBytes from 'pretty-bytes';
import { Linking } from 'react-native';
import { Card, useTheme, TouchableRipple } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import type { Post } from '../types';

type Props = {
  post: Post,
}

function PostPDFPreview({ post }: Props) {
  const theme = useTheme();

  const openPDF = useCallback(() => {
    if (post.attachment) {
      Linking.openURL(post.attachment);
    }
  }, [post.attachment]);

  const pdfIcon = useCallback(() => (
    <MaterialCommunityIcons
      name="pdf-box"
      color={theme.colors.notification}
      size={48}
    />
  ), [theme]);

  return (
    <TouchableRipple
      onPress={openPDF}
    >
      <Card.Title
        style={{ backgroundColor: theme.colors.background }}
        title={post.attachmentName}
        subtitle={post.attachmentSize ? prettyBytes(post.attachmentSize) : null}
        left={pdfIcon}
      />
    </TouchableRipple>
  );
}

export default PostPDFPreview;
