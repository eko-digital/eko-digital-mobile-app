// @flow
import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/functions';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-community/async-storage';
import { ActivityIndicator } from 'react-native-paper';
import { View, StyleSheet } from 'react-native';


import type { Account } from '../types';
import AccountsContext from '../contexts/AccountContext';
import AccountPicker from './AccountPicker';
import RootNavigator from './RootNavigator';

const defaultApp = firebase.app();
const functionsForMumbaiRegion = defaultApp.functions('asia-east2');

// Use a local emulator in development
// eslint-disable-next-line no-undef
if (__DEV__) {
  functionsForMumbaiRegion.useFunctionsEmulator('http://10.0.2.2:5001');
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

function Main() {
  const [showPicker, setShowPicker] = useState<boolean>(false);
  const [activeAccount, setActiveAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);
  const [accounts, setAccounts] = useState([]);

  const user = useMemo(() => auth().currentUser, []);
  const accountsCacheKey = `accounts_for_${user.uid}`;
  const activeAccountCacheKey = `active_account_for_${user.uid}`;

  const fetchAccounts = useCallback(async () => {
    let activeAccountId = null;
    try {
      const cachedAccounts = await AsyncStorage.getItem(accountsCacheKey);
      const cachedActiveAccountId = await AsyncStorage.getItem(activeAccountCacheKey);
      if (cachedAccounts) {
        const parsed: Account[] = JSON.parse(cachedAccounts);
        setAccounts(parsed);

        const cachedActiveAccount = parsed.find((ac) => ac.id === cachedActiveAccountId);

        if (cachedActiveAccount) {
          setActiveAccount(cachedActiveAccount);
          activeAccountId = parsed[0].id;
        } else if (parsed.length > 0) {
          setActiveAccount(parsed[0]);
          activeAccountId = parsed[0].id;
          await AsyncStorage.setItem(activeAccountCacheKey, parsed[0].id);
        }

        setLoading(false);
      }

      const { data } = await functionsForMumbaiRegion.httpsCallable('getUserAccounts')();

      if (data.accounts) {
        setAccounts(data.accounts);

        if (data.accounts.length > 0 && activeAccountId !== data.accounts[0].id) {
          setActiveAccount(data.accounts[0]);
          await AsyncStorage.setItem(activeAccountCacheKey, data.accounts[0].id);
        }

        await AsyncStorage.setItem(accountsCacheKey, JSON.stringify(data.accounts));
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching accounts', error);
    }
  }, [accountsCacheKey, activeAccountCacheKey]);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const togglePicker = useCallback(() => {
    setShowPicker((visible) => !visible);
  }, []);

  const handleAccountSelect = useCallback(async (account: Account) => {
    setActiveAccount(account);
    await AsyncStorage.setItem(activeAccountCacheKey, account.id);
    setShowPicker(false);
  }, [activeAccountCacheKey]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator animating />
      </View>
    );
  }

  return (
    <AccountsContext.Provider
      value={{
        account: activeAccount,
        switchAccount: togglePicker,
      }}
    >
      <RootNavigator />
      {accounts.length > 0 && (
        <AccountPicker
          visible={showPicker}
          accounts={accounts}
          onToggle={togglePicker}
          onSelect={handleAccountSelect}
        />
      )}
    </AccountsContext.Provider>
  );
}

export default Main;
