// @flow
import React, {
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import firestore from '@react-native-firebase/firestore';
import { FlatList } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { useNetInfo } from '@react-native-community/netinfo';

import type { Post } from '../types';
import EmptyScreen from './EmptyScreen';
import waiting from '../images/waiting.png';
import AccountContext from '../contexts/AccountContext';
import FullScreenActivityIndicator from './FullScreenActivityIndicator';
import ErrorScreen from './ErrorScreen';
import OfflineScreen from './OfflineScreen';
import PostCard from './PostCard';
import config from '../config';

const styles = StyleSheet.create({
  container: {
    padding: config.values.space.normal,
  },
});

type Props = {
  collection: 'lessons' | 'assignments';
}

function FavouritesList({ collection }: Props) {
  const [favorites, setFavorites] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingError, setLoadingError] = useState<boolean>(false);
  const { activeAccount } = useContext(AccountContext);

  const netInfo = useNetInfo();

  const fetchFavorites = useCallback(async () => {
    if (!activeAccount || activeAccount.isTeacher) {
      return;
    }

    setLoading(true);
    setLoadingError(false);

    const favIds = collection === 'lessons'
      ? activeAccount.favoriteLessons
      : activeAccount.favoriteAssignments;

    if (favIds && favIds.length > 0) {
      try {
        const snaps = await Promise.all(
          favIds.map((id) => firestore().collection(collection).doc(id).get()),
        );
        const docs = snaps
          .filter((snap) => snap.exists)
          .map((snap) => ({ id: snap.id, ...snap.data() }));
        setFavorites(docs);
      } catch (error) {
        setLoadingError(true);
        if (__DEV__) {
          // eslint-disable-next-line no-console
          console.error(error);
        }
      }
    }
    setLoading(false);
  }, [activeAccount, collection]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  if (!activeAccount) {
    return null;
  }

  if (loading) {
    return <FullScreenActivityIndicator />;
  }

  if (!netInfo.isConnected && favorites.length === 0) {
    return <OfflineScreen onRetry={fetchFavorites} />;
  }

  if (loadingError) {
    return (
      <ErrorScreen
        description={`Something went wrong while fetching ${collection}.`}
      />
    );
  }

  if (favorites.length === 0) {
    return (
      <EmptyScreen
        illustration={waiting}
        title={`Your favourite ${collection}`}
        description={`You can add a ${collection === 'lessons' ? 'lesson' : 'assignment'} to favourites by tapping on the heart icon.`}
      />
    );
  }

  return (
    <FlatList
      contentContainerStyle={styles.container}
      data={favorites}
      renderItem={({ item }) => (
        <PostCard
          post={item}
          postType={collection === 'lessons' ? 'lesson' : 'assignment'}
          activeAccount={activeAccount}
        />
      )}
      keyExtractor={(item) => item.id}
    />
  );
}

export default FavouritesList;
