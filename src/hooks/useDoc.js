// @flow
import {
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import { useNetInfo } from '@react-native-community/netinfo';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

type Results<Entity> = {
  loading: boolean,
  isOffline: boolean,
  exists: boolean,
  loadingError: boolean,
  data: Entity | null,
  retry: () => any,
};

function useDoc<Entity>(docRef: FirebaseFirestoreTypes.DocumentReference): Results<Entity> {
  const [loading, setLoading] = useState<boolean>(true);
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [exists, setExists] = useState<boolean>(false);
  const [loadingError, setLoadingError] = useState<boolean>(false);
  const [data, setData] = useState<Entity | null>(null);
  const [retryCount, setRetryCount] = useState<number>(0);

  const isMounted = useRef<boolean>(true);
  const netInfo = useNetInfo();

  const retry = useCallback(() => setRetryCount((i) => i + 1), []);

  useEffect(() => {
    isMounted.current = true;

    if (!docRef) {
      return undefined;
    }

    const unsubscribe = docRef.onSnapshot((snapshot) => {
      if (!isMounted.current) {
        return;
      }

      if (
        snapshot.metadata.fromCache
        && !netInfo.isConnected
      ) {
        setIsOffline(true);
      } else {
        setIsOffline(false);
      }

      if (snapshot.exists) {
        setData({
          id: snapshot.id,
          ...snapshot.data(),
        });
        setExists(true);
      } else {
        setExists(false);
      }

      setLoading(false);
    }, () => {
      setLoadingError(true);
      setLoading(false);
    });

    return () => {
      isMounted.current = false;
      unsubscribe();
    };
  }, [docRef, netInfo.isConnected, retryCount]);

  return {
    loading,
    isOffline,
    exists,
    loadingError,
    data,
    retry,
  };
}

export default useDoc;
