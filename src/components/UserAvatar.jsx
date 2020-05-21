/* eslint-disable react/require-default-props */
// @flow
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Avatar, ActivityIndicator, useTheme } from 'react-native-paper';

import type { Account } from '../types';
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

type Props = {
  account: Account,
  size?: number,
  loading?: boolean,
  style?: any,
}

function UserAvatar({
  account,
  size = 40,
  loading = false,
  style,
}: Props) {
  const theme = useTheme();

  const avatar = account.photoURL ? (
    <Avatar.Image
      style={style}
      source={{ uri: account.photoURL }}
      size={size}
    />
  ) : (
    <Avatar.Text
      style={style}
      label={getInitials(account.name)}
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
