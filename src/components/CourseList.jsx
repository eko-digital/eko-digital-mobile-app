// @flow
import React, { useContext, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import {
  Card, Caption, useTheme, Title, Subheading,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

import type { Course } from '../types';
import AccountContext from '../contexts/AccountContext';
import InstituteContext from '../contexts/InstituteContext';
import config from '../config';
import { capitalize } from '../utils';
import BodyText from './BodyText';

const styles = StyleSheet.create({
  container: {
    marginTop: config.values.space.large,
  },
  heading: {
    marginBottom: config.values.space.small,
  },
  card: {
    marginBottom: config.values.space.normal,
  },
  className: {
    marginTop: config.values.space.normal,
    fontSize: 14,
  },
  courseName: {
    marginTop: 0,
    lineHeight: 26,
  },
  description: {
    marginTop: config.values.space.small,
  },
});

function CourseList() {
  const { activeAccount } = useContext(AccountContext);
  const { institute, classes, courses } = useContext(InstituteContext);

  const theme = useTheme();
  const navigation = useNavigation();

  const userCourses = activeAccount?.courses;

  const navigateToCourse = useCallback((course: Course) => {
    navigation.navigate('Course', { courseId: course.id });
  }, [navigation]);

  if (!institute || !activeAccount || !userCourses) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Subheading style={styles.heading}>
        {capitalize(institute.i18n.coursePlural)}
      </Subheading>

      {userCourses.map((courseId) => {
        const course = courses.find((c) => c.id === courseId);
        const courseClass = classes.find((c) => c.id === course?.class);

        if (!course || !courseClass) {
          return null;
        }

        return (
          <Card
            key={course.id}
            style={styles.card}
            onPress={() => navigateToCourse(course)}
          >
            {course.thumbnail ? (
              <Card.Cover
                source={{ uri: course.thumbnail }}
              />
            ) : null}

            <Card.Content>
              <Caption
                style={[styles.className, { color: theme.colors.primary }]}
              >
                {courseClass.name}
              </Caption>
              <Title style={styles.courseName}>{course.name}</Title>
              {course.description ? (
                <BodyText
                  style={styles.description}
                >
                  {course.description}
                </BodyText>
              ) : null}
              {/* TODO: show number of lessons & assignments in the course */}
            </Card.Content>
          </Card>
        );
      })}
    </View>
  );
}

export default CourseList;
