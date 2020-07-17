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
  loadingError: boolean,
  docs: Entity[],
  retry: () => any,
};

function useDocsQuery<Entity>(query: FirebaseFirestoreTypes.Query): Results<Entity> {
  const [loading, setLoading] = useState<boolean>(true);
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [loadingError, setLoadingError] = useState<boolean>(false);
  const [docs, setDocs] = useState<Entity[]>([]);
  const [retryCount, setRetryCount] = useState<number>(0);

  const isMounted = useRef<boolean>(true);
  const netInfo = useNetInfo();

  const retry = useCallback(() => setRetryCount((i) => i + 1), []);

  useEffect(() => {
    isMounted.current = true;

    setLoading(true);
    setIsOffline(false);
    setLoadingError(false);
    setDocs([]);

    if (!query) {
      return undefined;
    }

    const unsubscribe = query.onSnapshot((snapshot) => {
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

      const items = [];

      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        items.push({
          id: doc.id,
          ...data,
        });
      });

      setDocs(items);
      setLoading(false);
    }, (error) => {
      if (__DEV__) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
      setLoadingError(true);
      setLoading(false);
    });

    return () => {
      isMounted.current = false;
      unsubscribe();
    };
  }, [netInfo.isConnected, query, retryCount]);

  return {
    loading,
    isOffline,
    loadingError,
    docs,
    retry,
  };
}

export default useDocsQuery;
