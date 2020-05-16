/* eslint-disable react/require-default-props */
// @flow
import React from 'react';
import { Avatar } from 'react-native-paper';

import type { Account } from '../types';
import { getInitials } from '../utils';

type Props = {
  account: Account,
  style?: any,
}

function UserAvatar({ account, style }: Props) {
  if (account.photoURL) {
    return (
      <Avatar.Image
        style={style}
        source={{ url: account.photoURL }}
        size={40}
      />
    );
  }

  return (
    <Avatar.Text
      style={style}
      label={getInitials(account.name)}
      size={40}
    />
  );
}

export default UserAvatar;
