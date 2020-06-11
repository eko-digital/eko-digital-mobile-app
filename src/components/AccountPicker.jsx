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

import type { Student, Teacher, Account } from '../types';
import UserAvatar from './UserAvatar';
import InstituteName from './InstituteName';
import { asTeacher } from '../utils';
import config from '../config';

const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: config.values.space.large,
  },
  account: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: config.values.space.small,
    paddingHorizontal: config.values.space.normal,
  },
  avatar: {
    marginRight: config.values.space.normal,
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
  students: Student[],
  teachers: Teacher[],
  onToggle: () => void,
  onSelect: (account: Account) => Promise<void>,
}

function AccountPicker({
  visible,
  students,
  teachers,
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
            {[students, teachers].flatMap((a) => a).map((account: Account) => (
              <TouchableRipple
                key={account.id}
                onPress={() => onSelect(account)}
              >
                <View style={styles.account}>
                  <UserAvatar
                    photoURL={account.photoURL}
                    name={account.name}
                    style={styles.avatar}
                  />
                  <View style={{ flexShrink: 1 }}>
                    <Paragraph
                      style={styles.accountName}
                      numberOfLines={1}
                      ellipsizeMode="middle"
                    >
                      {account.name}
                    </Paragraph>
                    <Caption style={styles.accountMeta}>
                      {asTeacher(account) ? 'Teacher' : 'Student'}
                      {', '}
                      <InstituteName account={account} />
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
