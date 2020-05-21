// @flow
import React, {
  useState,
  useContext,
  useMemo,
  useLayoutEffect,
  useCallback,
} from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Alert,
} from 'react-native';
import { TextInput, useTheme, Button } from 'react-native-paper';

import type { AssignmentType, DocumentPickerResult } from '../types';
import SelectInput from './SelectInput';
import ImagePicker from './ImagePicker';
import PDFPicker from './PDFPicker';
import AccountContext from '../contexts/AccountContext';

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  textInput: {
    marginTop: 12,
  },
});

type Props = {
  route: {
    params: {
      assignmentType: AssignmentType,
    },
  },
  navigation: any,
}

function NewAssignment({ route, navigation }: Props) {
  const { activeAccount } = useContext(AccountContext);
  const { assignmentType } = route.params;
  const [subject, setSubject] = useState<string | null>(null);
  const [image, setImage] = useState<DocumentPickerResult | null>(null);
  const [pdf, setPDF] = useState<DocumentPickerResult | null>(null);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [sending, setSending] = useState<boolean>(false);

  const theme = useTheme();

  const saveAssignment = useCallback(() => {
    if (
      (assignmentType === 'image' && !image)
      || (assignmentType === 'pdf' && !pdf)
    ) {
      Alert.alert(
        '',
        `Please select ${assignmentType === 'image' ? 'an image' : assignmentType} to upload.`,
        [{ text: 'OK' }],
      );
      return;
    }

    if (!subject) {
      Alert.alert(
        '',
        'Please select a target class/subject.',
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

    setSending(true);
  }, [image, assignmentType, pdf, subject, title]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: (
        <Button
          onPress={saveAssignment}
          style={{ marginRight: 8 }}
          loading={sending}
        >
          Send
        </Button>
      ),
    });
  }, [navigation, saveAssignment, sending, theme.colors.onSurface]);

  const subjectOptions: Array<{ label: string, value: string }> = useMemo(() => {
    if (!activeAccount || !activeAccount.subjects) {
      return [];
    }

    return activeAccount.subjects.map((sub) => ({
      label: `${sub.className}: ${sub.name}`,
      value: JSON.stringify(sub),
    }));
  }, [activeAccount]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {assignmentType === 'image' && (
        <ImagePicker
          image={image}
          onChange={setImage}
        />
      )}
      {assignmentType === 'pdf' && (
        <PDFPicker
          pdf={pdf}
          onChange={setPDF}
        />
      )}

      <View style={{ height: 12 }} />

      <SelectInput
        label="Class/Subject"
        selection={subject}
        options={subjectOptions}
        onSelect={setSubject}
      />

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

export default NewAssignment;
