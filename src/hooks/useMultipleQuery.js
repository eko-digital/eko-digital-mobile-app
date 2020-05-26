// @flow
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import useDocsQuery from './useDocsQuery';

type Results<Entity1, Entity2> = {
  loading: boolean,
  isOffline: boolean,
  loadingError: boolean,
  docs: [Entity1[], Entity2[]],
};

function useMultipleQuery<Entity1, Entity2>(
  query1: FirebaseFirestoreTypes.Query,
  query2: FirebaseFirestoreTypes.Query,
): Results<Entity1, Entity2> {
  const {
    loading: query1Loading,
    loadingError: query1LoadingError,
    isOffline: query1IsOffline,
    docs: query1Docs,
  } = useDocsQuery(query1);

  const {
    loading: query2Loading,
    loadingError: query2LoadingError,
    isOffline: query2IsOffline,
    docs: query2Docs,
  } = useDocsQuery(query2);

  return {
    loading: query1Loading || query2Loading,
    isOffline: query1LoadingError || query2LoadingError,
    loadingError: query1IsOffline || query2IsOffline,
    docs: [query1Docs, query2Docs],
  };
}

export default useMultipleQuery;
