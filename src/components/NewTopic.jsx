// @flow
import React, {
  useState,
  useLayoutEffect,
  useCallback,
} from 'react';
import {
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { TextInput, useTheme, Button } from 'react-native-paper';
import config from '../config';

const styles = StyleSheet.create({
  container: {
    paddingVertical: config.values.space.large,
    paddingHorizontal: config.values.space.normal,
  },
  textInput: {
    marginTop: 12,
  },
  sendButton: {
    marginRight: config.values.space.small,
  },
});

type Props = {
  navigation: any,
}

function NewLesson({ navigation }: Props) {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [sending, setSending] = useState<boolean>(false);

  const theme = useTheme();

  const saveLesson = useCallback(() => {
    if (!title) {
      Alert.alert(
        '',
        'Title is required.',
        [{ text: 'OK' }],
      );
      return;
    }

    if (!description) {
      Alert.alert(
        '',
        'Description can\'t be empty.',
        [{ text: 'OK' }],
      );
      return;
    }

    setSending(true);
  }, [description, title]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: (
        <Button
          onPress={saveLesson}
          style={styles.sendButton}
          loading={sending}
        >
          Send
        </Button>
      ),
    });
  }, [navigation, saveLesson, sending, theme.colors.onSurface]);

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
        value={description}
        style={styles.textInput}
        onChangeText={setDescription}
      />
    </ScrollView>
  );
}

export default NewLesson;
