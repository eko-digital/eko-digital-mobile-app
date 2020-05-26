// @flow
import React, { useState, useCallback, useMemo } from 'react';
import {
  Card,
  Menu,
  IconButton,
  useTheme,
} from 'react-native-paper';
import color from 'color';
import Upload from 'react-native-background-upload';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { Alert, StyleSheet } from 'react-native';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import type { Post, PostType, Account } from '../types';
import { asTeacher, asStudent, getAttachmentPath } from '../utils';
import PostVideoPreview from './PostVideoPreview';
import ReadMoreText from './ReadMoreText';
import PostPDFPreview from './PostPDFPreview';
import PostImagePreview from './PostImagePreview';
import config from '../config';

dayjs.extend(relativeTime);

const styles = StyleSheet.create({
  card: {
    marginBottom: config.values.space.small,
    overflow: 'hidden',
  },
});

type Props = {
  post: Post,
  postType: PostType,
  activeAccount: Account,
}

function PostCard({ post, postType, activeAccount }: Props) {
  const [menuVisible, setMenuVisible] = useState<boolean>(false);
  const theme = useTheme();

  const collection = useMemo(() => (postType === 'lesson' ? 'lessons' : 'assignments'), [postType]);

  const isFavourite: boolean = useMemo(() => {
    const student = asStudent(activeAccount);
    if (!student) {
      return false;
    }

    if (postType === 'lesson') {
      return student.favoriteLessons
        ? student.favoriteLessons.includes(post.id)
        : false;
    }

    return student.favoriteAssignments
      ? student.favoriteAssignments.includes(post.id)
      : false;
  }, [activeAccount, post.id, postType]);

  const toggleMenu = useCallback(() => {
    setMenuVisible((val) => !val);
  }, []);

  const toggleFavorite = useCallback(async () => {
    const favoritesField: string = postType === 'lesson'
      ? 'favoriteLessons'
      : 'favoriteAssignments';
    await firestore().collection('students').doc(activeAccount.id).update({
      [favoritesField]: isFavourite
        ? firestore.FieldValue.arrayRemove(post.id)
        : firestore.FieldValue.arrayUnion(post.id),
    });
  }, [activeAccount.id, isFavourite, post.id, postType]);

  const deleteLesson = useCallback(async () => {
    const { currentUser } = auth();
    if (!currentUser) {
      return;
    }
    await firestore().collection(collection).doc(post.id).delete();
    if (post.attachment) {
      const attachmentPath = getAttachmentPath(currentUser, activeAccount, collection, post.id);
      await storage().ref(attachmentPath).delete();
    }
  }, [activeAccount, collection, post.attachment, post.id]);

  const confirmDeletion = useCallback(async () => {
    Alert.alert(
      `Delete "${post.title}"?`,
      'Are you sure you want to delete this post. This action can not be undone.',
      [
        { text: 'Delete', style: 'destructive', onPress: deleteLesson },
        { text: 'Cancel', style: 'cancel' },
      ],
    );
  }, [deleteLesson, post.title]);

  const cancelUpload = useCallback(async () => {
    await Upload.cancelUpload(post.id);
    await deleteLesson();
  }, [deleteLesson, post.id]);

  let rippleColor = isFavourite ? theme.colors.placeholder : theme.colors.notification;
  rippleColor = color(rippleColor).alpha(0.3).string();

  const menu = (props) => (
    <>
      {asTeacher(activeAccount) ? (
        <Menu
          visible={menuVisible}
          onDismiss={toggleMenu}
          anchor={
            // eslint-disable-next-line react/jsx-props-no-spreading
            <IconButton {...props} icon="dots-vertical" onPress={toggleMenu} />
          }
        >
          {post.status === 'uploading' ? (
            <Menu.Item
              onPress={cancelUpload}
              title="Cancel upload"
              icon="cancel"
            />
          ) : (
            <Menu.Item
              onPress={confirmDeletion}
              title={`Delete ${postType}`}
              icon="delete"
            />
          )}
        </Menu>
      ) : (
        <IconButton
          icon={isFavourite ? 'heart' : 'heart-outline'}
          onPress={toggleFavorite}
          color={isFavourite ? theme.colors.notification : theme.colors.placeholder}
          rippleColor={rippleColor}
        />
      )}
    </>
  );

  const meta = [];
  if (post.subject) {
    meta.push(post.subject);
  }
  if (post.createdAt) {
    // eslint-disable-next-line no-underscore-dangle
    meta.push(dayjs.unix(post.createdAt._seconds).fromNow());
  }

  return (
    <Card style={styles.card}>
      {post.type === 'video' && <PostVideoPreview post={post} />}
      {post.type === 'image' && <PostImagePreview post={post} />}
      <Card.Title
        title={post.title}
        subtitle={meta.join(' • ')}
        right={menu}
        subtitleNumberOfLines={2}
      />
      {post.description ? (
        <Card.Content>
          <ReadMoreText text={post.description} />
        </Card.Content>
      ) : null}
      {/* returning empty <Card.Content /> in next line to fix bottom padding issue on android */}
      {post.type === 'pdf' ? <PostPDFPreview post={post} /> : <Card.Content />}
    </Card>
  );
}

export default PostCard;
