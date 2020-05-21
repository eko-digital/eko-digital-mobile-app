// @flow
import AsyncStorage from '@react-native-community/async-storage';

import type { Account } from '../types';

class AccountsCache {
  accountsCacheKey: string;

  activeAccountCacheKey: string;

  constructor(userId: string) {
    this.accountsCacheKey = `accounts_for_${userId}`;
    this.activeAccountCacheKey = `active_account_for_${userId}`;
  }

  setAccounts = async (accounts: Account[]) => {
    await AsyncStorage.setItem(this.accountsCacheKey, JSON.stringify(accounts));
  };

  getAccounts = async (): Promise<Account[] | null> => {
    const accounts = await AsyncStorage.getItem(this.accountsCacheKey);
    return accounts ? JSON.parse(accounts) : null;
  };

  setActiveAccount = async (accountId: string) => {
    await AsyncStorage.setItem(this.activeAccountCacheKey, accountId);
  };

  getActiveAccount = async (): Promise<string | null> => {
    const activeAccountId: string = await AsyncStorage.getItem(this.activeAccountCacheKey);
    return activeAccountId;
  };

  clear = async () => {
    await AsyncStorage.removeItem(this.accountsCacheKey);
    await AsyncStorage.removeItem(this.activeAccountCacheKey);
  };
}

export default AccountsCache;
