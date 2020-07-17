// @flow
import React, {
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import firestore from '@react-native-firebase/firestore';
import { StyleSheet, FlatList } from 'react-native';
import { useNetInfo } from '@react-native-community/netinfo';

import type {
  Lesson, Assignment, CourseItemType,
} from '../types';
import EmptyScreen from './EmptyScreen';
import waiting from '../images/waiting.png';
import AccountContext from '../contexts/AccountContext';
import FullScreenActivityIndicator from './FullScreenActivityIndicator';
import ErrorScreen from './ErrorScreen';
import OfflineScreen from './OfflineScreen';
import CourseItem from './CourseItem';
import config from '../config';
import { capitalize } from '../utils';

const styles = StyleSheet.create({
  container: {
    padding: config.values.space.normal,
  },
});

type Props = {
  itemType: CourseItemType,
}

function BookmarksList({ itemType }: Props) {
  const [items, setItems] = useState<Array<Lesson | Assignment>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingError, setLoadingError] = useState<boolean>(false);
  const { activeAccount } = useContext(AccountContext);

  const netInfo = useNetInfo();
  const collection = useMemo(() => `${itemType}s`, [itemType]);
  const bookmarksField = useMemo(() => `bookmarked${capitalize(itemType)}s`, [itemType]);

  const fetchItems = useCallback(async () => {
    if (!activeAccount || activeAccount.isTeacher) {
      return;
    }

    setLoading(true);
    setLoadingError(false);

    if (activeAccount[bookmarksField] && activeAccount[bookmarksField].length > 0) {
      try {
        const snaps = await Promise.all(
          activeAccount[bookmarksField]
            .map((id) => firestore().collection(collection).doc(id).get()),
        );
        const docs = snaps
          .filter((snap) => snap.exists)
          .map((snap) => ({ id: snap.id, ...snap.data() }));
        setItems(docs);
      } catch (error) {
        setLoadingError(true);
        if (__DEV__) {
          // eslint-disable-next-line no-console
          console.error(error);
        }
      }
    } else {
      setItems([]);
    }
    setLoading(false);
  }, [activeAccount, bookmarksField, collection]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  if (!activeAccount) {
    return null;
  }

  if (loading) {
    return <FullScreenActivityIndicator />;
  }

  if (!netInfo.isConnected && items.length === 0) {
    return <OfflineScreen onRetry={fetchItems} />;
  }

  if (loadingError) {
    return (
      <ErrorScreen
        description={`Something went wrong while fetching ${collection}.`}
      />
    );
  }

  if (items.length === 0) {
    return (
      <EmptyScreen
        illustration={waiting}
        title={`Your bookmarked ${collection}`}
        description={`You can bookmark ${itemType === 'assignment' ? 'an assignment' : `a ${itemType}`} by tapping on the bookmark icon.`}
      />
    );
  }

  return (
    <FlatList
      contentContainerStyle={styles.container}
      data={items}
      renderItem={({ item }) => (
        <CourseItem
          item={item}
          itemType={itemType}
          activeAccount={activeAccount}
        />
      )}
      keyExtractor={(item) => item.id}
    />
  );
}

export default BookmarksList;
