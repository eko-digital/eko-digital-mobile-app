// @flow
import {
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import AsyncStorage from '@react-native-community/async-storage';

import type { Institute, Account } from '../types';
import { getCallableFunction, asTeacher } from '../utils';

type Response = {|
  loading: boolean,
  loadingError: boolean,
  institute: Institute | null,
  retry: () => Promise<void>,
|}

function useInstitute(account: Account | null): Response {
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingError, setLoadingError] = useState<boolean>(false);
  const [institute, setInstitute] = useState<Institute | null>(null);

  const cacheKey = useMemo(() => (account ? `institute_data_${account.institute}` : 'institute_data'), [account]);

  const fetchInstitute = useCallback(async () => {
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
          cacheData.institute
          && cacheData.lastCached
          && cacheData.lastCached > (Date.now() - 24 * 60 * 60 * 1000)
        ) {
          fetchFromServer = false;
          setInstitute(cacheData.institute);
          setLoading(false);
        }
      }

      if (fetchFromServer) {
        const getInstituteData = await getCallableFunction('getInstituteData');
        const response = await getInstituteData({
          id: account.institute,
          userId: account.id,
          isTeacher: Boolean(asTeacher(account)),
        });
        setInstitute(response.data);
        await AsyncStorage.setItem(cacheKey, JSON.stringify({
          lastCached: Date.now(),
          institute: response.data,
        }));
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      setLoadingError(true);
    }
  }, [account, cacheKey]);

  useEffect(() => {
    fetchInstitute();
  }, [fetchInstitute]);

  return {
    loading,
    loadingError,
    institute,
    retry: fetchInstitute,
  };
}

export default useInstitute;
