// @flow
import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { ActivityIndicator } from 'react-native-paper';
import AsyncStorage from '@react-native-community/async-storage';
import auth from '@react-native-firebase/auth';

import type { Student, Teacher, Account } from '../types';
import AccountContext from '../contexts/AccountContext';
import AccountPicker from './AccountPicker';
import useMultipleQuery from '../hooks/useMultipleQuery';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

type Props = {
  children: React.Node,
};

function AccountProvider({ children }: Props) {
  const [initializing, setInitializing] = React.useState<boolean>(true);
  const [emailVerificationPending, setEmailVerificationPending] = React.useState<boolean>(false);
  const [showPicker, setShowPicker] = React.useState<boolean>(false);
  const [activeAccountId, setActiveAccountId] = React.useState<string | null>(null);

  const authUser = React.useMemo(() => auth().currentUser, []);
  const activeAccountCacheKey = React.useMemo(() => `active_account_for_${authUser.id}`, [authUser]);

  const studentsQuery = React.useMemo(() => {
    if (!authUser) {
      return null;
    } if (authUser.phoneNumber) {
      return firestore().collection('students').where('phoneNumber', '==', authUser.phoneNumber);
    } if (authUser.email && authUser.emailVerified) {
      return firestore().collection('students').where('email', '==', authUser.email);
    } if (authUser.email && !authUser.emailVerified) {
      setEmailVerificationPending(true);
    }

    return null;
  }, [authUser]);

  const teachersQuery = React.useMemo(() => {
    if (!authUser) {
      return null;
    } if (authUser.phoneNumber) {
      return firestore().collection('teachers').where('phoneNumber', '==', authUser.phoneNumber);
    } if (authUser.email && authUser.emailVerified) {
      return firestore().collection('teachers').where('email', '==', authUser.email);
    }

    return null;
  }, [authUser]);

  const {
    loading,
    loadingError,
    isOffline,
    docs: [students, teachers],
  } = useMultipleQuery<Student, Teacher>(studentsQuery, teachersQuery);

  React.useEffect(() => {
    AsyncStorage.getItem(activeAccountCacheKey).then((cachedActiveAccountId) => {
      if (cachedActiveAccountId) {
        setActiveAccountId(cachedActiveAccountId);
      }
    });
  }, [activeAccountCacheKey]);

  const getActiveAccount = React.useCallback(() => {
    let returnValue;
    let activeAccount = students.find((student) => student.id === activeAccountId);

    if (activeAccount) {
      returnValue = { ...activeAccount, isTeacher: false };
    } else {
      activeAccount = teachers.find((teacher) => teacher.id === activeAccountId);
      if (activeAccount) {
        returnValue = { ...activeAccount, isTeacher: true };
      }
    }

    return returnValue || null;
  }, [activeAccountId, students, teachers]);

  React.useEffect(() => {
    if (loading) {
      return;
    }

    const activeAccount = getActiveAccount();

    if (!activeAccount) {
      let newActiveAccount = null;
      if (students.length > 0) {
        [newActiveAccount] = students;
      } else if (teachers.length > 0) {
        [newActiveAccount] = teachers;
      }
      if (newActiveAccount) {
        setActiveAccountId(newActiveAccount.id);
        AsyncStorage.setItem(activeAccountCacheKey, newActiveAccount.id);
      }
    }
    setInitializing(false);
  }, [activeAccountCacheKey, getActiveAccount, loading, students, teachers]);

  const togglePicker = React.useCallback(() => {
    setShowPicker((visible) => !visible);
  }, []);

  const handleAccountSelect = React.useCallback(async (account: Account) => {
    setActiveAccountId(account.id);
    await AsyncStorage.setItem(activeAccountCacheKey, account.id);
    setShowPicker(false);
  }, [activeAccountCacheKey]);

  const activeAccount = React.useMemo(() => getActiveAccount(), [getActiveAccount]);

  if ((loading || initializing) && !emailVerificationPending) {
    return (
      <View style={styles.container}>
        <ActivityIndicator animating />
      </View>
    );
  }

  return (
    <>
      <AccountContext.Provider
        value={{
          loading,
          activeAccount,
          loadingError,
          isOffline,
          switchAccount: togglePicker,
        }}
      >
        {children}
        {(students.length > 0 || teachers.length > 0) && (
          <AccountPicker
            visible={showPicker}
            students={students}
            teachers={teachers}
            onToggle={togglePicker}
            onSelect={handleAccountSelect}
          />
        )}
      </AccountContext.Provider>
    </>
  );
}

export default AccountProvider;
