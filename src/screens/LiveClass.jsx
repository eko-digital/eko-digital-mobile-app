/* eslint-disable react-hooks/exhaustive-deps */
// @flow
import React, {
  useMemo, useContext, useEffect, useCallback, useState,
} from 'react';
import firestore from '@react-native-firebase/firestore';
import { StyleSheet, View, Alert } from 'react-native';
import {
  Button, List, useTheme, Caption,
} from 'react-native-paper';

import dayjs from 'dayjs';
import type { Lesson } from '../types';
import useDoc from '../hooks/useDoc';
import InstituteContext from '../contexts/InstituteContext';
import FullScreenActivityIndicator from '../components/FullScreenActivityIndicator';
import OfflineScreen from '../components/OfflineScreen';
import ErrorScreen from '../components/ErrorScreen';
import AccountContext from '../contexts/AccountContext';
import config from '../config';
import { secondsToHms, prettyWeekdaysSelection, getCallableFunction } from '../utils';
import ReadMoreText from '../components/ReadMoreText';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: config.values.space.normal,
  },
  textCenter: {
    textAlign: 'center',
  },
});

type Props = {
  route: {
    params: {
      id: string,
    },
  },
  navigation: any,
}

function LiveClass({ route, navigation }: Props) {
  const [initializing, setInitializing] = useState<boolean>(true);
  const [fetchingToken, setFetchingToken] = useState<boolean>(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [ended, setEnded] = useState<boolean>(false);
  const { params: { id } } = route;
  const { courses } = useContext(InstituteContext);
  const { activeAccount } = useContext(AccountContext);

  const theme = useTheme();

  const lessonRef = useMemo(() => firestore().collection('lessons').doc(id), [id]);
  const {
    loading,
    loadingError,
    isOffline,
    data: lesson,
    retry,
  } = useDoc<Lesson>(lessonRef);

  const course = useMemo(() => {
    if (!lesson) {
      return null;
    }

    return courses.find((c) => c.id === lesson.course);
  }, [lesson, courses]);

  useEffect(() => {
    if (!lesson) {
      return undefined;
    }

    navigation.setOptions({
      title: lesson?.title,
      subtitle: course?.name,
    });

    const calculateTimeRemaining = () => {
      const secondsNow = Date.now() / 1000;
      // eslint-disable-next-line no-underscore-dangle
      const startsAt = lesson.from?._seconds;
      const endsAt = lesson.to?._seconds;
      const diff = startsAt ? startsAt - secondsNow : 0;
      setTimeRemaining(diff);
      setEnded(!endsAt || endsAt < secondsNow);
    };

    const timerId = setInterval(calculateTimeRemaining, 1000);
    calculateTimeRemaining();
    setInitializing(false);

    return () => clearInterval(timerId);
  }, [lesson, course, navigation]);

  const navigateToJitsiMeet = useCallback(async () => {
    if (!lesson || !activeAccount) {
      return;
    }

    setFetchingToken(true);

    try {
      const getLiveClassToken = await getCallableFunction('getLiveClassToken');

      const { data: { token } } = await getLiveClassToken({
        userId: activeAccount.id,
        isTeacher: activeAccount.isTeacher,
        lessonId: lesson.id,
      });

      navigation.navigate('JitsiMeet', {
        id,
        url: `https://jitsi.eko.digital/${lesson.id}?jwt=${token}`,
      });
    } catch (error) {
      Alert.alert(
        'Oops!',
        `Something went wrong while ${activeAccount.isTeacher ? 'starting' : 'joining'}`
          + ' the class. Please try again.',
        [{ text: 'OK' }],
      );
      console.error(error);
    }

    setFetchingToken(false);
  }, [activeAccount, lesson, navigation]);

  if (loading) {
    return <FullScreenActivityIndicator />;
  }

  if (isOffline && !lesson) {
    return <OfflineScreen onRetry={retry} />;
  }

  if (loadingError || !lesson) {
    return (
      <ErrorScreen
        description="Something went wrong while fetching live class data."
      />
    );
  }

  if (initializing) {
    return <FullScreenActivityIndicator />;
  }

  let content = null;

  if (activeAccount?.isTeacher) {
    if (ended) {
      content = (
        <Caption>
          {`This live class has ended at ${dayjs.unix(lesson.to?._seconds).format(lesson.repeating ? 'LT' : 'lll')}.`}
        </Caption>
      );
    } else {
      content = (
        <Button
          onPress={navigateToJitsiMeet}
          loading={fetchingToken}
          mode="contained"
        >
          Start class
        </Button>
      );
    }
  } else if (lesson.live) {
    content = (
      <Button
        onPress={navigateToJitsiMeet}
        loading={fetchingToken}
        mode="contained"
      >
        Join class
      </Button>
    );
  } else if (timeRemaining < 0) {
    if (ended) {
      content = (
        <Caption>
          {`This class is over${lesson.repeating ? ' for today' : ''}.`}
        </Caption>
      );
    } else {
      content = (
        <Caption>
          Waiting for your teacher to start the class.
        </Caption>
      );
    }
  } else if (timeRemaining < 60 * 60) {
    content = (
      <Caption>
        {`Your class will start in ${secondsToHms(timeRemaining)}`}
      </Caption>
    );
  } else if (timeRemaining > 0) {
    content = (
      <Caption>
        {`Your class will start at ${dayjs.unix(lesson.to?._seconds).format(lesson.repeating ? 'LT' : 'lll')}`}
      </Caption>
    );
  }

  return (
    <View style={styles.container}>
      {lesson.description ? (
        <ReadMoreText text={lesson.description} />
      ) : null}
      <List.Section>
        <List.Item
          title="From"
          description={dayjs.unix(lesson.from?._seconds).format(lesson.repeating ? 'LT' : 'lll')}
          // eslint-disable-next-line react/jsx-props-no-spreading
          left={(props) => <List.Icon {...props} icon="clock-outline" color={theme.colors.primary} />}
        />
        <List.Item
          title="To"
          description={dayjs.unix(lesson.to?._seconds).format(lesson.repeating ? 'LT' : 'lll')}
          // eslint-disable-next-line react/jsx-props-no-spreading
          left={(props) => <List.Icon {...props} icon="clock-check-outline" color={theme.colors.primary} />}
        />
        {lesson.repeating && (
          <List.Item
            title="Every"
            description={prettyWeekdaysSelection((lesson.repeatsOn: any))}
            // eslint-disable-next-line react/jsx-props-no-spreading
            left={(props) => <List.Icon {...props} icon="update" color={theme.colors.primary} />}
          />
        )}
      </List.Section>
      <View>
        {content}
      </View>
    </View>
  );
}

export default LiveClass;
