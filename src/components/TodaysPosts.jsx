// @flow
import React, { useContext, useMemo, useCallback } from 'react';
import {
  ScrollView, StyleSheet, Dimensions, View,
} from 'react-native';
import {
  Card, Caption, useTheme, Title, Subheading, ActivityIndicator,
} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

import type { Lesson, Assignment } from '../types';
import AccountContext from '../contexts/AccountContext';
import InstituteContext from '../contexts/InstituteContext';
import config from '../config';
import useDocsQuery from '../hooks/useDocsQuery';
import ErrorScreen from './ErrorScreen';
import BodyText from './BodyText';
import AttachmentCover from './CourseItem/AttachmentCover';
import { getItemMeta } from '../utils';

dayjs.extend(localizedFormat);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 1,
    paddingBottom: config.values.space.extraSmall,
  },
  heading: {
    marginBottom: config.values.space.small,
  },
  card: {
    position: 'relative',
    overflow: 'hidden',
  },
  courseName: {
    marginTop: config.values.space.normal,
  },
  itemName: {
    marginTop: 0,
    lineHeight: 26,
  },
});

function TodaysPosts() {
  const { activeAccount } = useContext(AccountContext);
  const { classes, courses } = useContext(InstituteContext);

  const theme = useTheme();
  const navigation = useNavigation();

  const startOfTheDay = useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }, []);

  const userCourses = activeAccount?.courses;
  const { width: windowWidth } = Dimensions.get('window');

  const lessonsQuery = useMemo(() => {
    const activeAccountCourses = activeAccount?.courses;
    if (!activeAccount || !activeAccountCourses) {
      return null;
    }

    if (activeAccount.isTeacher) {
      return firestore().collection('lessons')
        .where('teacher', '==', activeAccount.id)
        .where('institute', '==', activeAccount.institute)
        .where('createdAt', '>=', startOfTheDay)
        .orderBy('createdAt', 'desc');
    }

    return firestore().collection('lessons')
      // "in" queries are limited to a maximum of 10 different values
      .where('course', 'in', activeAccountCourses.slice(0, 10))
      .where('createdAt', '>=', startOfTheDay)
      .where('status', '==', 'available')
      .orderBy('createdAt', 'desc');
  }, [activeAccount, startOfTheDay]);

  const assignmentsQuery = useMemo(() => {
    const activeAccountCourses = activeAccount?.courses;
    if (!activeAccount || !activeAccountCourses) {
      return null;
    }

    if (activeAccount.isTeacher) {
      return firestore().collection('assignments')
        .where('teacher', '==', activeAccount.id)
        .where('institute', '==', activeAccount.institute)
        .where('createdAt', '>=', startOfTheDay)
        .orderBy('createdAt', 'desc');
    }

    return firestore().collection('assignments')
      // "in" queries are limited to a maximum of 10 different values
      .where('course', 'in', activeAccountCourses.slice(0, 10))
      .where('createdAt', '>=', startOfTheDay)
      .orderBy('createdAt', 'desc');
  }, [activeAccount, startOfTheDay]);

  const {
    loading: loadingLessons,
    loadingError: lessonLoadingError,
    docs: lessons,
    retry: retryLessons,
  } = useDocsQuery<Lesson>(lessonsQuery);

  const {
    loading: loadingAssignments,
    loadingError: assignmentLoadingError,
    docs: assignments,
    retry: retryAssignments,
  } = useDocsQuery<Assignment>(assignmentsQuery);

  const retry = useCallback(() => {
    retryLessons();
    retryAssignments();
  }, [retryAssignments, retryLessons]);

  const navigateToItem = useCallback((item: Lesson | Assignment, itemType: 'lesson' | 'assignment') => {
    const routeName = item.type === 'live' ? 'LiveClass' : 'SingleCourseItem';
    navigation.navigate(routeName, { id: item.id, itemType });
  }, [navigation]);

  const renderCard = useCallback((item: Lesson | Assignment, itemType: 'lesson' | 'assignment') => {
    const course = courses.find((c) => c.id === item.course);
    const courseClass = classes.find((c) => c.id === course?.class);

    if (!course || !courseClass) {
      return null;
    }

    const meta = getItemMeta({ item });

    return (
      <Card
        key={item.id}
        style={[
          styles.card,
          {
            width: windowWidth * 0.7,
            marginRight: windowWidth * 0.05,
          },
        ]}
        onPress={() => navigateToItem(item, itemType)}
      >
        {item.attachment && ['image', 'video'].includes(item.attachment.type) && (
          <AttachmentCover item={item} />
        )}
        <Card.Content>
          <Caption style={[styles.courseName, { color: theme.colors.primary }]}>
            {course.name}
          </Caption>
          <Title style={styles.itemName}>{item.title}</Title>
          <Caption>{meta.join(' • ')}</Caption>
          {/* TODO: show watch status
                    (or number of views in case of teachers),
                    (maybe create a reusable card for lessons and assignments) */}
        </Card.Content>
      </Card>
    );
  }, [classes, courses, navigateToItem, theme.colors.primary, windowWidth]);

  if (loadingLessons || loadingAssignments) {
    return <ActivityIndicator />;
  }

  if (lessonLoadingError || assignmentLoadingError) {
    return (
      <ErrorScreen
        description="Something went wrong while loading latest lessons & assignments."
        onRetry={retry}
      />
    );
  }

  if (!activeAccount || !userCourses) {
    return null;
  }

  return (
    <View>
      <Subheading style={styles.heading}>Today</Subheading>
      {lessons.length === 0 && assignments.length === 0 && (
        <BodyText>No new lessons or assignments for today.</BodyText>
      )}
      <ScrollView
        contentContainerStyle={[
          styles.container,
          {
            width: (windowWidth * 0.75 * userCourses.length) - (windowWidth * 0.05) + 2,
          },
        ]}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {lessons.map((item) => renderCard(item, 'lesson'))}
        {assignments.map((item) => renderCard(item, 'assignment'))}
      </ScrollView>
    </View>
  );
}

export default TodaysPosts;
