// @flow
import React, {
  useMemo, useLayoutEffect, useCallback, useContext,
} from 'react';
import { SceneMap } from 'react-native-tab-view';
import {
  Portal, FAB, useTheme,
} from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { useSafeArea } from 'react-native-safe-area-context';
import { useIsFocused } from '@react-navigation/native';

import config from '../config';
import Tabs from '../components/Tabs';
import Lessons from '../components/Lessons';
import Assignments from '../components/Assignments';
import Discuss from '../components/Discuss';
import AccountContext from '../contexts/AccountContext';
import InstituteContext from '../contexts/InstituteContext';

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: config.values.space.normal,
    right: 0,
    bottom: 0,
  },
});

type Props = {
  route: {
    params: {
      courseId: string,
    }
  },
  navigation: any,
}

function Course({ route, navigation }: Props) {
  const [index, setIndex] = React.useState<number>(0);
  const [addLessonFabOpen, setAddLessonFabOpen] = React.useState<boolean>(false);
  const { params: { courseId } } = route;

  const safeArea = useSafeArea();
  const isFocused = useIsFocused();
  const theme = useTheme();

  const { activeAccount } = useContext(AccountContext);
  const { courses } = useContext(InstituteContext);

  const course = useMemo(() => courses.find((c) => c.id === courseId), [courseId, courses]);

  const handleLessonFabStateChange = useCallback(({ open }) => setAddLessonFabOpen(open), []);

  const navigateToScheduleLiveClass = useCallback(() => {
    navigation.navigate('ScheduleLiveClass', { courseId });
  }, [courseId, navigation]);

  const navigateToNewLesson = useCallback(() => {
    navigation.navigate('NewLesson', { courseId });
  }, [courseId, navigation]);

  const navigateToNewAssignment = useCallback(() => {
    navigation.navigate('NewAssignment', { courseId });
  }, [courseId, navigation]);

  const navigateToNewTopic = useCallback(() => {
    navigation.navigate('NewTopic', { courseId });
  }, [navigation, courseId]);

  useLayoutEffect(() => {
    if (!course) {
      return;
    }

    navigation.setOptions({
      hasTabs: true,
      title: course.name,
    });
  }, [course, navigation, theme.colors.placeholder]);

  const CourseLessons = useMemo(() => () => course && (
    <Lessons course={course} />
  ), [course]);

  const CourseAssignments = useMemo(() => () => course && (
    <Assignments course={course} />
  ), [course]);

  const CourseDiscuss = useMemo(() => () => course && (
    <Discuss course={course} />
  ), [course]);

  const routes = React.useMemo(() => [
    { key: 'lessons', title: 'Lessons' },
    { key: 'assignments', title: 'Assignments' },
    { key: 'discuss', title: 'Discuss' },
  ], []);

  const renderScene = SceneMap({
    lessons: CourseLessons,
    assignments: CourseAssignments,
    discuss: CourseDiscuss,
  });

  if (!activeAccount) {
    return null;
  }

  return (
    <>
      <Tabs
        routes={routes}
        renderScene={renderScene}
        onIndexChange={setIndex}
      />
      <Portal>
        <FAB.Group
          open={addLessonFabOpen}
          visible={isFocused && activeAccount.isTeacher && index === 0}
          style={{ marginBottom: safeArea.bottom }}
          actions={[
            { icon: 'clock-outline', label: 'Schedule', onPress: navigateToScheduleLiveClass },
            { icon: 'cloud-upload-outline', label: 'Upload', onPress: navigateToNewLesson },
          ]}
          accessibilityLabel="Add new lesson"
          icon="teach"
          onStateChange={handleLessonFabStateChange}
        />
        <FAB
          visible={isFocused && activeAccount.isTeacher && index === 1}
          style={[styles.fab, { marginBottom: safeArea.bottom + config.values.space.normal }]}
          accessibilityLabel="Add new assignment"
          icon="clipboard-check-outline"
          onPress={navigateToNewAssignment}
        />
        <FAB
          visible={isFocused && index === 2}
          style={[styles.fab, { marginBottom: safeArea.bottom + config.values.space.normal }]}
          accessibilityLabel="New topic"
          icon="comment-plus-outline"
          onPress={navigateToNewTopic}
        />
      </Portal>
    </>
  );
}

export default Course;
