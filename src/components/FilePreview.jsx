// @flow
import React, { useCallback } from 'react';
import prettyBytes from 'pretty-bytes';
import { useTheme } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import MultilineCardTitle from './MultilineCardTitle';

type Props = {
  type: 'pdf' | 'other',
  name: string,
  size: number,
}

function FilePreview({ type, name, size }: Props) {
  const theme = useTheme();

  const icon = useCallback(() => (
    <MaterialCommunityIcons
      name={type === 'pdf' ? 'pdf-box' : 'attachment'}
      color={type === 'pdf' ? theme.colors.notification : theme.colors.placeholder}
      size={40}
    />
  ), [theme.colors.notification, theme.colors.placeholder, type]);

  return (
    <MultilineCardTitle
      title={name}
      subtitle={prettyBytes(size)}
      left={icon}
      titleNumberOfLines={4}
    />
  );
}

export default FilePreview;
