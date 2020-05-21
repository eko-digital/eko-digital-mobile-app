// @flow
import React from 'react';
import {
  Portal,
  Dialog,
  Caption,
  TouchableRipple,
  Paragraph,
} from 'react-native-paper';
import { View, StyleSheet, ScrollView } from 'react-native';

import type { Account } from '../types';
import UserAvatar from './UserAvatar';

const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 20,
  },
  account: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  avatar: {
    marginRight: 10,
  },
  accountName: {
    flexShrink: 1,
    fontWeight: 'bold',
    marginRight: 3,
  },
  accountMeta: {
    fontSize: 14,
    lineHeight: 14,
  },
});

type Props = {
  visible: boolean,
  accounts: Account[],
  onToggle: () => void,
  onSelect: (account: Account) => Promise<void>,
}

function AccountPicker({
  visible,
  accounts,
  onToggle,
  onSelect,
}: Props) {
  return (
    <Portal>
      <Dialog
        visible={visible}
        onDismiss={onToggle}
      >
        <Dialog.Title>Accounts</Dialog.Title>
        <Dialog.ScrollArea style={{ padding: 0 }}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            {accounts.map((account) => (
              <TouchableRipple
                key={account.id}
                onPress={() => onSelect(account)}
              >
                <View style={styles.account}>
                  <UserAvatar account={account} style={styles.avatar} />
                  <View style={{ flexShrink: 1 }}>
                    <Paragraph
                      style={styles.accountName}
                      numberOfLines={1}
                      ellipsizeMode="middle"
                    >
                      {account.name}
                    </Paragraph>
                    <Caption style={styles.accountMeta}>
                      {account.isTeacher ? 'Teacher' : 'Student'}
                      {', '}
                      {account.school.name}
                    </Caption>
                  </View>
                </View>
              </TouchableRipple>
            ))}
          </ScrollView>
        </Dialog.ScrollArea>
      </Dialog>
    </Portal>
  );
}

export default AccountPicker;
