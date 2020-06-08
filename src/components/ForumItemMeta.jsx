/* eslint-disable react/require-default-props */
// @flow
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Caption, useTheme } from 'react-native-paper';

import type { FirestoreTimestamp, ForumUser } from '../types';
import UserAvatar from './UserAvatar';
import prettyTime from '../helpers/prettyTime';
import config from '../config';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  description: {
    marginLeft: config.values.space.small,
  },
  author: {
    fontWeight: 'bold',
    marginVertical: 0,
  },
  time: {
    marginVertical: 0,
    marginTop: -4,
  },
});

type Props = {
  author: ForumUser,
  timestamp?: FirestoreTimestamp,
}

function ForumItemMeta({ author, timestamp = null }: Props) {
  const theme = useTheme();

  const authorColor = author.isTeacher
    ? theme.colors.primary
    : theme.colors.placeholder;

  return (
    <View style={styles.container}>
      <UserAvatar
        name={author.name}
        photoURL={author.photoURL}
        size={36}
      />
      <View style={styles.description}>
        <Caption style={[styles.author, { color: authorColor }]}>
          {author.name}
        </Caption>
        {timestamp && (
          <Caption style={styles.time}>
            {prettyTime(timestamp)}
          </Caption>
        )}
      </View>
    </View>
  );
}

export default ForumItemMeta;
