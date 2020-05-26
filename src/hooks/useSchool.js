// @flow
import {
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import AsyncStorage from '@react-native-community/async-storage';

import type { School, Account } from '../types';
import { getCallableFunction, asTeacher } from '../utils';

type Response = {|
  loading: boolean,
  loadingError: boolean,
  school: School | null,
  retry: () => Promise<void>,
|}

function useSchool(account: Account | null): Response {
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingError, setLoadingError] = useState<boolean>(false);
  const [school, setSchool] = useState<School | null>(null);

  const cacheKey = useMemo(() => (account ? `school_data_${account.school}` : 'school_data'), [account]);

  const fetchSchool = useCallback(async () => {
    if (!account) {
      return;
    }

    setLoading(true);

    try {
      const cacheString = await AsyncStorage.getItem(cacheKey);
      let fetchFromServer = true;

      if (cacheString) {
        const cacheData = JSON.parse(cacheString);
        if (
          cacheData.school
          && cacheData.lastCached
          && cacheData.lastCached > (Date.now() - 24 * 60 * 60 * 1000)
        ) {
          fetchFromServer = false;
          setSchool(cacheData.school);
          setLoading(false);
        }
      }

      if (fetchFromServer) {
        const getSchoolData = await getCallableFunction('getSchoolData');
        const response = await getSchoolData({
          id: account.school,
          userId: account.id,
          isTeacher: Boolean(asTeacher(account)),
        });
        setSchool(response.data);
        await AsyncStorage.setItem(cacheKey, JSON.stringify({
          lastCached: Date.now(),
          school: response.data,
        }));
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      setLoadingError(true);
    }
  }, [account, cacheKey]);

  useEffect(() => {
    fetchSchool();
  }, [fetchSchool]);

  return {
    loading,
    loadingError,
    school,
    retry: fetchSchool,
  };
}

export default useSchool;
