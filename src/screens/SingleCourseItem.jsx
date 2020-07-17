// @flow
import React, {
  useMemo, useEffect, useContext, useCallback,
} from 'react';
import {
  ScrollView, StyleSheet, View, useWindowDimensions,
} from 'react-native';
import {
  Headline, useTheme, Caption, Card, Subheading,
} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';

import type { Lesson, Assignment } from '../types';
import useDoc from '../hooks/useDoc';
import FullScreenActivityIndicator from '../components/FullScreenActivityIndicator';
import InstituteContext from '../contexts/InstituteContext';
import OfflineScreen from '../components/OfflineScreen';
import ErrorScreen from '../components/ErrorScreen';
import config from '../config';
import ReadMoreText from '../components/ReadMoreText';
import StreamVideoPlayer from '../components/StreamVideoPlayer';
import prettyTime from '../helpers/prettyTime';
import AudioPlayer from '../components/AudioPlayer';
import DownloadableFileCard from '../components/DownloadableFileCard';
import AccountContext from '../contexts/AccountContext';
import AssignmentSubmissions from '../components/AssignmentSubmissions';
import AssignmentSubmissionForm from '../components/AssignmentSubmissionForm';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: config.values.space.normal,
  },
  title: {
    marginTop: config.values.space.normal,
  },
  attachmentCard: {
    marginVertical: config.values.space.small,
  },
  submissionHeading: {
    marginTop: config.values.space.normal,
    marginBottom: config.values.space.small,
  },
});

type Props = {
  route: {
    params: {
      id: string,
      itemType: 'lesson' | 'assignment',
    },
  },
  navigation: any,
}

function SingleCourseItem({ route, navigation }: Props) {
  const { params: { id, itemType } } = route;
  const { courses } = useContext(InstituteContext);
  const { activeAccount } = useContext(AccountContext);

  const theme = useTheme();
  const { width } = useWindowDimensions();

  const collection = useMemo(() => (itemType === 'lesson' ? 'lessons' : 'assignments'), [itemType]);

  const itemRef = useMemo(() => firestore().collection(collection).doc(id), [collection, id]);
  const {
    loading,
    loadingError,
    isOffline,
    data: item,
    retry,
  } = useDoc<Lesson | Assignment>(itemRef);

  const course = useMemo(() => {
    if (!item) {
      return null;
    }

    return courses.find((c) => c.id === item.course);
  }, [item, courses]);

  useEffect(() => {
    navigation.setOptions({
      subtitle: course?.name,
    });
  }, [item, course, navigation]);

  const navigateToFullScreenImage = useCallback(() => {
    navigation.navigate('FullScreenImage', {
      uri: item?.attachment?.url,
      title: item?.title,
    });
  }, [item, navigation]);

  if (loading) {
    return <FullScreenActivityIndicator />;
  }

  if (isOffline && !item) {
    return <OfflineScreen onRetry={retry} />;
  }

  if (loadingError || !item) {
    return (
      <ErrorScreen
        description={`Something went wrong while fetching ${itemType}`}
      />
    );
  }

  return (
    <View style={styles.container}>
      {item.attachment && item.attachment.type === 'video' && item.attachment.streamToken && (
        <StreamVideoPlayer
          token={item.attachment.streamToken}
          style={{ width, height: width * 0.5625 }}
        />
      )}
      <ScrollView style={styles.contentContainer}>
        {item.attachment && item.attachment.type === 'image' && item.attachment.url && (
          <Card onPress={navigateToFullScreenImage}>
            <Card.Cover source={{ uri: item.attachment.url }} />
          </Card>
        )}
        <Headline style={[styles.title, { ...theme.fonts.medium }]}>{item.title}</Headline>
        {item.createdAt && <Caption>{prettyTime(item.createdAt)}</Caption>}
        {item.attachment && item.attachment.type === 'audio' && item.attachment.url && (
          <Card style={styles.attachmentCard}>
            <AudioPlayer
              id={item.id}
              artist={item.teacher}
              title={item.title}
              url={item.attachment.url}
            />
          </Card>
        )}

        {
          item.attachment
          && (item.attachment.type === 'pdf' || item.attachment.type === 'other')
          && item.attachment.url && (
            <DownloadableFileCard
              type={item.attachment.type}
              name={item.attachment.name}
              size={item.attachment.size}
              uri={item.attachment.url}
              localFileName={`${itemType}-${item.id}-${item.attachment.name}`}
              style={styles.attachmentCard}
            />
          )
        }

        {item.description ? (
          <ReadMoreText text={item.description} />
        ) : null}

        {itemType === 'assignment' && activeAccount?.isTeacher ? (
          <>
            <Subheading
              style={[styles.submissionHeading, { ...theme.fonts.medium }]}
            >
              Submissions
            </Subheading>
            <AssignmentSubmissions assignment={(item: any)} />
          </>
        ) : null}

        {itemType === 'assignment' && !activeAccount?.isTeacher ? (
          <AssignmentSubmissionForm assignment={(item: any)} />
        ) : null}
      </ScrollView>
    </View>
  );
}

export default SingleCourseItem;
