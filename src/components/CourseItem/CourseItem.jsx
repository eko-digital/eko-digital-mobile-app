// @flow
import React, {
  useState, useCallback, useMemo, useEffect,
} from 'react';
import {
  Card,
  Menu,
  IconButton,
  useTheme,
  ProgressBar,
} from 'react-native-paper';
import color from 'color';
import Upload from 'react-native-background-upload';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { Alert, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import type {
  Lesson,
  Assignment,
  Account,
} from '../../types';
import config from '../../config';
import MultilineCardTitle from '../MultilineCardTitle';
import { capitalize, getItemMeta } from '../../utils';
import AttachmentCover from './AttachmentCover';

const styles = StyleSheet.create({
  card: {
    marginBottom: config.values.space.normal,
    overflow: 'hidden',
  },
  typeIconWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

type Props = {|
  item: Lesson | Assignment,
  itemType: 'lesson' | 'assignment',
  activeAccount: Account,
|}

function PostCard({
  item,
  itemType,
  activeAccount,
}: Props) {
  const [menuVisible, setMenuVisible] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const theme = useTheme();
  const navigation = useNavigation();

  const collection = useMemo(() => `${itemType}s`, [itemType]);
  const bookmarksField = useMemo(() => `bookmarked${capitalize(itemType)}s`, [itemType]);

  const isError = useMemo(() => item.status === 'processing-error' || uploadError, [item.status, uploadError]);
  const isUploading = useMemo(() => Boolean(item.status === 'uploading' && uploadProgress), [item.status, uploadProgress]);
  const isProcessing = useMemo(
    () => item.status === 'processing' || (item.status === 'uploading' && !uploadProgress),
    [item.status, uploadProgress],
  );

  const isBookmarked: boolean = useMemo(() => {
    if (!activeAccount || activeAccount.isTeacher) {
      return false;
    }

    return activeAccount[bookmarksField]
      ? activeAccount[bookmarksField].includes(item.id)
      : false;
  }, [activeAccount, bookmarksField, item.id]);

  useEffect(() => {
    const progressEventSubscription = Upload.addListener('progress', item.id, (data) => {
      setUploadProgress(data.progress);
    });

    const errorEventSubscription = Upload.addListener('error', item.id, (error) => {
      console.error(`${item.attachment?.type || ''} upload error`, error);
      setUploadError(true);
      setUploadProgress(null);
    });

    const completedEventSubscription = Upload.addListener('completed', item.id, () => {
      setUploadProgress(null);
    });

    return () => {
      progressEventSubscription.remove();
      errorEventSubscription.remove();
      completedEventSubscription.remove();
    };
  }, [item]);

  const navigateToItem = useCallback(() => {
    const routeName = item.type === 'live' ? 'LiveClass' : 'SingleCourseItem';
    navigation.navigate(routeName, { id: item.id, itemType });
  }, [item, itemType, navigation]);

  const toggleMenu = useCallback(() => {
    setMenuVisible((val) => !val);
  }, []);

  const toggleBookmark = useCallback(async () => {
    await firestore().collection('students').doc(activeAccount.id).update({
      [bookmarksField]: isBookmarked
        ? firestore.FieldValue.arrayRemove(item.id)
        : firestore.FieldValue.arrayUnion(item.id),
    });
  }, [activeAccount.id, bookmarksField, isBookmarked, item.id]);

  const deletePost = useCallback(async () => {
    const { currentUser } = auth();
    if (!currentUser) {
      return;
    }
    await firestore().collection(collection).doc(item.id).delete();
  }, [collection, item.id]);

  const confirmDeletion = useCallback(async () => {
    Alert.alert(
      `Delete "${item.title}"?`,
      'Are you sure you want to delete this post. This action can not be undone.',
      [
        { text: 'Delete', style: 'destructive', onPress: deletePost },
        { text: 'Cancel', style: 'cancel' },
      ],
    );
  }, [deletePost, item.title]);

  const cancelUpload = useCallback(async () => {
    await Upload.cancelUpload(item.id);
    await deletePost();
  }, [deletePost, item.id]);

  let rippleColor = isBookmarked ? theme.colors.placeholder : theme.colors.notification;
  rippleColor = color(rippleColor).alpha(0.3).string();

  const menu = (props) => (
    <>
      {activeAccount?.isTeacher ? (
        <Menu
          visible={menuVisible}
          onDismiss={toggleMenu}
          anchor={
            // eslint-disable-next-line react/jsx-props-no-spreading
            <IconButton {...props} icon="dots-vertical" onPress={toggleMenu} />
          }
        >
          {item.status === 'uploading' ? (
            <Menu.Item
              onPress={cancelUpload}
              title="Cancel upload"
              icon="cancel"
            />
          ) : (
            <Menu.Item
              onPress={confirmDeletion}
              title={`Delete ${itemType}`}
              icon="delete"
            />
          )}
        </Menu>
      ) : (
        <IconButton
          icon={isBookmarked ? 'bookmark' : 'bookmark-outline'}
          onPress={toggleBookmark}
          color={isBookmarked ? theme.colors.primary : theme.colors.placeholder}
          rippleColor={rippleColor}
        />
      )}
    </>
  );

  const typeIconName = useMemo(() => {
    if (item.type === 'live') {
      return 'video-wireless-outline';
    }

    if (!item.attachment) {
      return null;
    }

    switch (item.attachment.type) {
      case 'video':
        return 'video-outline';

      case 'audio':
        return 'headphones';

      case 'image':
        return 'image-outline';

      case 'pdf':
        return 'file-pdf-outline';

      default:
        return 'attachment';
    }
  }, [item]);

  const typeIcon = useCallback(({ size }) => (
    <View
      style={[
        styles.typeIconWrapper,
        {
          width: size,
          height: size,
          backgroundColor: isError ? theme.colors.error : theme.colors.primary,
          borderRadius: theme.roundness,
        },
      ]}
    >
      <MaterialCommunityIcons
        size={22}
        name={typeIconName}
        color="#fff"
      />
    </View>
  ), [isError, theme, typeIconName]);

  const meta = useMemo(() => getItemMeta({
    item, isError, isUploading, uploadProgress, uploadError, isProcessing,
  }), [isError, isProcessing, isUploading, item, uploadError, uploadProgress]);

  return (
    <Card style={styles.card} onPress={navigateToItem}>
      {item.attachment && ['image', 'video'].includes(item.attachment.type) && (
        <AttachmentCover
          item={item}
          isError={isError}
          isUploading={isUploading}
          isProcessing={isProcessing}
          uploadError={uploadError}
          uploadProgress={uploadProgress}
        />
      )}
      <MultilineCardTitle
        title={item.title}
        titleNumberOfLines={4}
        subtitle={meta.join(' • ')}
        subtitleStyle={{ color: isError ? theme.colors.error : theme.colors.placeholder }}
        subtitleNumberOfLines={3}
        left={item.attachment || item.type === 'live' ? typeIcon : undefined}
        right={menu}
      />
      {isUploading && uploadProgress && <ProgressBar progress={uploadProgress / 100} />}
      {isProcessing && uploadProgress && <ProgressBar indeterminate />}
    </Card>
  );
}

export default PostCard;
