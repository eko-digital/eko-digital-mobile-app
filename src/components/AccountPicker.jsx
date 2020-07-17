// @flow
import React, { useCallback } from 'react';
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
import config from '../config';

const styles = StyleSheet.create({
  scrollArea: {
    paddingHorizontal: 0,
  },
  scrollContainer: {
    paddingVertical: config.values.space.large,
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
  const renderAccount = useCallback((account: Account, isTeacher: boolean) => (
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
            {isTeacher ? 'Teacher' : 'Student'}
            {', '}
            <InstituteName instituteId={account.institute} />
          </Caption>
        </View>
      </View>
    </TouchableRipple>
  ), [onSelect]);

  return (
    <Portal>
      <Dialog
        visible={visible}
        onDismiss={onToggle}
      >
        <Dialog.Title>Accounts</Dialog.Title>
        <Dialog.ScrollArea style={styles.scrollArea}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            {students.map((account) => renderAccount(account, false))}
            {teachers.map((account) => renderAccount(account, true))}
          </ScrollView>
        </Dialog.ScrollArea>
      </Dialog>
    </Portal>
  );
}

export default AccountPicker;
