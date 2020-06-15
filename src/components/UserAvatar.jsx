// @flow
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Avatar, ActivityIndicator, useTheme } from 'react-native-paper';

import { getInitials } from '../utils';

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  loadingOverlay: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

type Props = {|
  name: string,
  photoURL?: string,
  size?: number,
  loading?: boolean,
  style?: any,
|}

function UserAvatar({
  name,
  photoURL,
  size = 40,
  loading = false,
  style,
}: Props) {
  const theme = useTheme();

  const avatar = photoURL ? (
    <Avatar.Image
      style={style}
      source={{ uri: photoURL }}
      size={size}
    />
  ) : (
    <Avatar.Text
      style={style}
      label={getInitials(name)}
      size={size}
    />
  );

  const loadingOverlay = loading ? (
    <View
      style={[
        StyleSheet.absoluteFill,
        {
          backgroundColor: theme.colors.backdrop,
          borderRadius: size / 2,
        },
        styles.loadingOverlay,
      ]}
    >
      <ActivityIndicator color="#fff" />
    </View>
  ) : null;

  return (
    <View style={styles.container}>
      {avatar}
      {loadingOverlay}
    </View>
  );
}

export default UserAvatar;
