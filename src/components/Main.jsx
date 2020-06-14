// @flow
import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
} from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { ActivityIndicator } from 'react-native-paper';
import { View, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import type { Student, Teacher, Account } from '../types';
import AccountsContext from '../contexts/AccountContext';
import AccountPicker from './AccountPicker';
import RootNavigator from './RootNavigator';
import useMultipleQuery from '../hooks/useMultipleQuery';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

function Main() {
  const [initializing, setInitializing] = useState<boolean>(true);
  const [showPicker, setShowPicker] = useState<boolean>(false);
  const [activeAccountId, setActiveAccountId] = useState<string | null>(null);

  const currentUser = useMemo(() => auth().currentUser, []);
  const activeAccountCacheKey = useMemo(() => `active_account_for_${currentUser.id}`, [currentUser]);

  const studentsQuery = useMemo(() => {
    if (!currentUser) {
      return null;
    } if (currentUser.phoneNumber) {
      return firestore().collection('students').where('phoneNumber', '==', currentUser.phoneNumber);
    } if (currentUser.email && currentUser.emailVerified) {
      return firestore().collection('students').where('email', '==', currentUser.email);
    }

    return null;
  }, [currentUser]);

  const teachersQuery = useMemo(() => {
    if (!currentUser) {
      return null;
    } if (currentUser.phoneNumber) {
      return firestore().collection('teachers').where('phoneNumber', '==', currentUser.phoneNumber);
    } if (currentUser.email && currentUser.emailVerified) {
      return firestore().collection('teachers').where('email', '==', currentUser.email);
    }

    return null;
  }, [currentUser]);

  const {
    loading,
    loadingError,
    isOffline,
    docs: [students, teachers],
  } = useMultipleQuery<Student, Teacher>(studentsQuery, teachersQuery);

  useEffect(() => {
    AsyncStorage.getItem(activeAccountCacheKey).then((cachedActiveAccountId) => {
      if (cachedActiveAccountId) {
        setActiveAccountId(cachedActiveAccountId);
      }
    });
  }, [activeAccountCacheKey]);

  const getActiveAccount = useCallback(() => {
    let activeAccount = students.find((student) => student.id === activeAccountId);

    if (!activeAccount) {
      activeAccount = teachers.find((teacher) => teacher.id === activeAccountId);
    }
    return activeAccount || null;
  }, [activeAccountId, students, teachers]);

  useEffect(() => {
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

  const togglePicker = useCallback(() => {
    setShowPicker((visible) => !visible);
  }, []);

  const handleAccountSelect = useCallback(async (account: Account) => {
    setActiveAccountId(account.id);
    await AsyncStorage.setItem(activeAccountCacheKey, account.id);
    setShowPicker(false);
  }, [activeAccountCacheKey]);

  const activeAccount = useMemo(() => getActiveAccount(), [getActiveAccount]);

  if (loading || initializing) {
    return (
      <View style={styles.container}>
        <ActivityIndicator animating />
      </View>
    );
  }

  return (
    <AccountsContext.Provider
      value={{
        loading,
        activeAccount,
        loadingError,
        isOffline,
        switchAccount: togglePicker,
      }}
    >
      <RootNavigator />
      {(students.length > 0 || teachers.length > 0) && (
        <AccountPicker
          visible={showPicker}
          students={students}
          teachers={teachers}
          onToggle={togglePicker}
          onSelect={handleAccountSelect}
        />
      )}
    </AccountsContext.Provider>
  );
}

export default Main;
