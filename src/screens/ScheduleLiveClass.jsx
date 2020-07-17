// @flow
import React, {
  useContext, useLayoutEffect, useCallback, useState, useMemo,
} from 'react';
import {
  Button, TextInput, TouchableRipple, Text, Checkbox,
} from 'react-native-paper';
import {
  StyleSheet, ScrollView, View, Keyboard, Alert,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

import type { WeekdaysShort, Lesson } from '../types';
import AccountContext from '../contexts/AccountContext';
import InstituteContext from '../contexts/InstituteContext';
import config from '../config';
import { capitalize } from '../utils';

dayjs.extend(localizedFormat);

const styles = StyleSheet.create({
  container: {
    padding: config.values.space.normal,
  },
  saveButton: {
    marginRight: config.values.space.small,
  },
  textInput: {
    marginTop: 12,
  },
  checkboxItem: {
    paddingHorizontal: 0,
  },
  weekdaysPickerWrapper: {
    marginVertical: config.values.space.small,
  },
  weekdaysToggleButton: {
    minWidth: 32,
    marginHorizontal: 4,
  },
  weekdaysToggleButtonLabel: {
    marginVertical: 6,
  },
});

type Props = {
  route: {
    params: {
      courseId: string,
    },
  },
  navigation: any,
}

function ScheduleLiveClass({ route, navigation }: Props) {
  const now = useMemo(() => new Date(), []);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [from, setFrom] = useState<Date>(now);
  const [to, setTo] = useState<Date>(new Date(now.getTime() + 30 * 60 * 1000));
  const [isRepeating, setIsRepeating] = useState<boolean>(true);
  const [repeatsOn, setRepeatsOn] = useState<WeekdaysShort[]>(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
  const [dateFromTimePickerVisible, setFromTimePickerVisible] = useState<boolean>(false);
  const [dateToTimePickerVisible, setToTimePickerVisible] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const { activeAccount } = useContext(AccountContext);
  const { institute, courses } = useContext(InstituteContext);
  const { params: { courseId } } = route;

  const saveLiveClass = useCallback(async () => {
    Keyboard.dismiss();
    if (!institute) {
      return;
    }

    if (!courseId) {
      Alert.alert(
        '',
        `${capitalize(institute.i18n.courseSingular)} is required.`,
        [{ text: 'OK' }],
      );
      return;
    }

    if (!title) {
      Alert.alert(
        '',
        'Title is required.',
        [{ text: 'OK' }],
      );
      return;
    }

    if (isRepeating && repeatsOn.length === 0) {
      Alert.alert(
        '',
        'Please select at least one weekday for repeating classes.',
        [{ text: 'OK' }],
      );
      return;
    }

    const { currentUser } = auth();

    if (!activeAccount || !currentUser) {
      return;
    }

    setIsSaving(true);

    try {
      const lessonRef = firestore().collection('lessons').doc();

      const lesson: $Diff<Lesson, { id: string, from: any, to: any }> | { from: Date, to: Date } = {
        type: 'live',
        title,
        description,
        course: courseId,
        teacher: activeAccount.id,
        institute: activeAccount.institute,
        status: 'available',
        repeating: isRepeating,
        repeatsOn,
        from,
        to,
        createdAt: firestore.FieldValue.serverTimestamp(),
      };

      await lessonRef.set(lesson);

      navigation.goBack();
    } catch (error) {
      setIsSaving(false);
      Alert.alert(
        'Oops!',
        'Something went wrong while saving this live class.'
          + ` Please try again or contact your ${institute?.type || 'institute'} if the issue persists.`,
        [
          { text: 'OK', style: 'cancel' },
          { text: 'Retry', onPress: saveLiveClass },
        ],
      );

      if (__DEV__) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    }
  // eslint-disable-next-line max-len
  }, [institute, courseId, title, isRepeating, repeatsOn, activeAccount, description, from, to, navigation]);

  useLayoutEffect(() => {
    const course = courses.find((c) => c.id === courseId);
    navigation.setOptions({
      headerRight: (
        <Button
          onPress={saveLiveClass}
          style={styles.saveButton}
          loading={isSaving}
        >
          Save
        </Button>
      ),
      subtitle: course?.name,
    });
  }, [courseId, courses, isSaving, navigation, saveLiveClass]);

  const toggleFromTimePicker = useCallback(() => {
    setFromTimePickerVisible((visible) => !visible);
  }, []);

  const toggleToTimePicker = useCallback(() => {
    setToTimePickerVisible((visible) => !visible);
  }, []);

  const toggleRepeating = useCallback(() => {
    setIsRepeating((repeating) => !repeating);
  }, []);

  const toggleWeekday = useCallback((day: WeekdaysShort) => {
    setRepeatsOn((days) => {
      if (days.includes(day)) {
        return days.filter((d) => d !== day);
      }
      return [...days, day];
    });
  }, []);

  const handleFromConfirm = useCallback((date: Date) => {
    setFromTimePickerVisible(false);
    setFrom(date);
  }, []);

  const handleToConfirm = useCallback((date: Date) => {
    setToTimePickerVisible(false);
    setTo(date);
  }, []);

  const renderFromInputText = useCallback((props: { style: any, value: string }) => {
    const { style, value } = props;

    return (
      <TouchableRipple onPress={toggleFromTimePicker}>
        <Text style={style}>{value}</Text>
      </TouchableRipple>
    );
  }, [toggleFromTimePicker]);

  const renderToInputText = useCallback((props: { style: any, value: string }) => {
    const { style, value } = props;

    return (
      <TouchableRipple onPress={toggleToTimePicker}>
        <Text style={style}>{value}</Text>
      </TouchableRipple>
    );
  }, [toggleToTimePicker]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        label="Title"
        mode="outlined"
        value={title}
        style={styles.textInput}
        onChangeText={setTitle}
      />

      <TextInput
        label="Description"
        mode="outlined"
        multiline
        numberOfLines={4}
        value={description}
        style={styles.textInput}
        onChangeText={setDescription}
      />

      <View style={styles.textInput}>
        <Checkbox.Item
          label="Repeat"
          status={isRepeating ? 'checked' : 'unchecked'}
          onPress={toggleRepeating}
          style={styles.checkboxItem}
        />
      </View>

      {isRepeating && (
        <ScrollView
          horizontal
          contentContainerStyle={styles.weekdaysPickerWrapper}
          showsHorizontalScrollIndicator={false}
        >
          <Button
            mode={repeatsOn.includes('Sun') ? 'contained' : 'outlined'}
            compact
            style={styles.weekdaysToggleButton}
            labelStyle={styles.weekdaysToggleButtonLabel}
            onPress={() => toggleWeekday('Sun')}
          >
            S
          </Button>
          <Button
            mode={repeatsOn.includes('Mon') ? 'contained' : 'outlined'}
            compact
            style={styles.weekdaysToggleButton}
            labelStyle={styles.weekdaysToggleButtonLabel}
            onPress={() => toggleWeekday('Mon')}
          >
            M
          </Button>
          <Button
            mode={repeatsOn.includes('Tue') ? 'contained' : 'outlined'}
            compact
            style={styles.weekdaysToggleButton}
            labelStyle={styles.weekdaysToggleButtonLabel}
            onPress={() => toggleWeekday('Tue')}
          >
            T
          </Button>
          <Button
            mode={repeatsOn.includes('Wed') ? 'contained' : 'outlined'}
            compact
            style={styles.weekdaysToggleButton}
            labelStyle={styles.weekdaysToggleButtonLabel}
            onPress={() => toggleWeekday('Wed')}
          >
            W
          </Button>
          <Button
            mode={repeatsOn.includes('Thu') ? 'contained' : 'outlined'}
            compact
            style={styles.weekdaysToggleButton}
            labelStyle={styles.weekdaysToggleButtonLabel}
            onPress={() => toggleWeekday('Thu')}
          >
            T
          </Button>
          <Button
            mode={repeatsOn.includes('Fri') ? 'contained' : 'outlined'}
            compact
            style={styles.weekdaysToggleButton}
            labelStyle={styles.weekdaysToggleButtonLabel}
            onPress={() => toggleWeekday('Fri')}
          >
            F
          </Button>
          <Button
            mode={repeatsOn.includes('Sat') ? 'contained' : 'outlined'}
            compact
            style={styles.weekdaysToggleButton}
            labelStyle={styles.weekdaysToggleButtonLabel}
            onPress={() => toggleWeekday('Sat')}
          >
            S
          </Button>
        </ScrollView>
      )}

      <TextInput
        label="From"
        mode="outlined"
        value={dayjs(from).format(isRepeating ? 'LT' : 'lll')}
        style={styles.textInput}
        render={renderFromInputText}
      />

      <TextInput
        label="To"
        mode="outlined"
        value={dayjs(to).format(isRepeating ? 'LT' : 'lll')}
        style={styles.textInput}
        render={renderToInputText}
      />

      <DateTimePickerModal
        mode={isRepeating ? 'time' : 'datetime'}
        date={from}
        headerTextIOS={isRepeating ? 'Pick a time' : 'Pick a date & time'}
        isVisible={dateFromTimePickerVisible}
        onConfirm={handleFromConfirm}
        onCancel={toggleFromTimePicker}
      />

      <DateTimePickerModal
        mode={isRepeating ? 'time' : 'datetime'}
        date={to}
        headerTextIOS={isRepeating ? 'Pick a time' : 'Pick a date & time'}
        isVisible={dateToTimePickerVisible}
        onConfirm={handleToConfirm}
        onCancel={toggleToTimePicker}
      />
    </ScrollView>
  );
}

export default ScheduleLiveClass;
