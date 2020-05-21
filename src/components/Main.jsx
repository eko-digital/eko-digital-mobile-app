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
import { ActivityIndicator } from 'react-native-paper';
import { View, StyleSheet } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { useNetInfo } from '@react-native-community/netinfo';

import type { Account } from '../types';
import AccountsContext from '../contexts/AccountContext';
import AccountPicker from './AccountPicker';
import RootNavigator from './RootNavigator';
import AccountsCache from '../helpers/AccountsCache';

const defaultApp = firebase.app();
const functionsForMumbaiRegion = defaultApp.functions('asia-east2');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

function Main() {
  const [showPicker, setShowPicker] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [loadingError, setLoadingError] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [activeAccount, setActiveAccount] = useState<Account | null>(null);

  const netInfo = useNetInfo();

  const user = useMemo(() => auth().currentUser, []);
  const accountsCache = useMemo(() => new AccountsCache(user.uid), [user.uid]);

  const fetchAccounts = useCallback(async () => {
    setLoading(true);

    let activeAccountId = null;

    try {
      const isEmulator = await DeviceInfo.isEmulator();
      if (isEmulator) {
        functionsForMumbaiRegion.useFunctionsEmulator('http://10.0.2.2:5001');
      }

      const cachedAccounts = await accountsCache.getAccounts();
      const cachedActiveAccountId = await accountsCache.getActiveAccount();
      if (cachedAccounts) {
        setAccounts(cachedAccounts);

        const cachedActiveAccount = cachedAccounts.find((ac) => ac.id === cachedActiveAccountId);

        if (cachedActiveAccount) {
          setActiveAccount(cachedActiveAccount);
          activeAccountId = cachedActiveAccountId;
        } else if (cachedAccounts.length > 0) {
          setActiveAccount(cachedAccounts[0]);
          activeAccountId = cachedAccounts[0].id;
          await accountsCache.setActiveAccount(cachedAccounts[0].id);
        }
      }

      const { data } = await functionsForMumbaiRegion.httpsCallable('getUserAccounts')();

      if (data.accounts) {
        setAccounts(data.accounts);

        if (data.accounts.length > 0) {
          const activeAccountFromServer = data.accounts.find((ac) => ac.id === activeAccountId)
            || data.accounts[0];
          setActiveAccount(activeAccountFromServer);
          await accountsCache.setActiveAccount(activeAccountFromServer.id);
        }

        await accountsCache.setAccounts(data.accounts);
      }
    } catch (error) {
      setLoadingError(true);
      console.error('Error fetching accounts', error);
    }

    setLoading(false);
  }, [accountsCache]);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts, netInfo.isConnected]);

  const togglePicker = useCallback(() => {
    setShowPicker((visible) => !visible);
  }, []);

  const handleAccountSelect = useCallback(async (account: Account) => {
    setActiveAccount(account);
    await accountsCache.setActiveAccount(account.id);
    setShowPicker(false);
  }, [accountsCache]);

  if (loading && accounts.length === 0) {
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
        accountsCache,
        switchAccount: togglePicker,
        fetchAccounts,
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
