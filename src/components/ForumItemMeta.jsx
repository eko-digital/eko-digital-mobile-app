/* eslint-disable react/require-default-props */
// @flow
import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  Caption,
  useTheme,
  Menu,
  IconButton,
} from 'react-native-paper';

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
  actions: {
    marginLeft: 'auto',
    marginRight: -1 * config.values.space.small,
  },
});

type Action = {
  title: string,
  icon?: string,
  onAction: () => any,
}

type Props = {
  author: ForumUser,
  timestamp?: FirestoreTimestamp,
  actions?: Action[] | null,
  extra?: React.Node | null,
}

function ForumItemMeta({
  author,
  timestamp = null,
  actions = null,
  extra = null,
}: Props) {
  const [menuVisible, setMenuVisible] = React.useState<boolean>(false);
  const theme = useTheme();

  const toggleMenu = React.useCallback(() => setMenuVisible((val) => !val), []);

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
            {extra}
          </Caption>
        )}
      </View>
      {actions && (
        <View style={styles.actions}>
          <Menu
            visible={menuVisible}
            onDismiss={toggleMenu}
            anchor={
              <IconButton icon="dots-vertical" onPress={toggleMenu} />
            }
          >
            {actions.map((action) => (
              <Menu.Item
                key={action.title}
                title={action.title}
                icon={action.icon}
                onPress={action.onAction}
              />
            ))}
          </Menu>
        </View>
      )}
    </View>
  );
}

export default ForumItemMeta;
