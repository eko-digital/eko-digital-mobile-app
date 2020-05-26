// @flow
import React, {
  useContext,
  useCallback,
  useState,
  useMemo,
} from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useTheme, List, TouchableRipple } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ImagePicker from 'react-native-image-crop-picker';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';

import type { SchoolClass, TeacherClassSubject } from '../types';
import UserAvatar from './UserAvatar';
import AccountContext from '../contexts/AccountContext';
import { asTeacher, asStudent, getTeacherClassSubjects } from '../utils';
import useSchool from '../hooks/useSchool';
import useSchoolClasses from '../hooks/useSchoolClasses';
import config from '../config';

const styles = StyleSheet.create({
  container: {
    padding: config.values.space.normal,
    alignItems: 'center',
  },
  photoButton: {
    position: 'relative',
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    padding: 10,
    borderRadius: 22,
  },
  detailsSection: {
    width: '100%',
    marginTop: 30,
  },
});

function Profile() {
  const [uploading, setUploading] = useState<boolean>(false);
  const [image, setImage] = useState<string | null>(null);

  const { activeAccount: account } = useContext(AccountContext);
  const theme = useTheme();
  const { currentUser } = auth();
  const { school } = useSchool(account);
  const { classes } = useSchoolClasses(account);

  const uploadImage = useCallback(async (localImagePath: string) => {
    if (!account) {
      return;
    }

    setUploading(true);

    try {
      const collection = asTeacher(account) ? 'teachers' : 'students';

      const remoteRef = storage().ref(`users/${currentUser.uid}/photos/${account.id}`);
      await remoteRef.putFile(localImagePath);
      const downloadUrl = await remoteRef.getDownloadURL();
      await firestore().collection(collection)
        .doc(account.id)
        .update({ photoURL: downloadUrl });
    } catch (error) {
      console.error(error);
    }

    setUploading(false);
  }, [account, currentUser.uid]);

  const changePhoto = useCallback(async () => {
    try {
      const result = await ImagePicker.openPicker({
        mediaType: 'photo',
        width: 432,
        height: 432,
        cropping: true,
        cropperCircleOverlay: true,
        cropperActiveWidgetColor: theme.colors.primary,
        cropperToolbarColor: '#FFFFFF',
      });
      setImage(result.path);
      await uploadImage(result.path);
      setImage(null);
    } catch (error) {
      if (error.message.toLowerCase().includes('user cancelled')) {
        return;
      }
      console.error(error);
    }
  }, [theme.colors.primary, uploadImage]);

  const studentClass: SchoolClass | null = useMemo(() => {
    const student = asStudent(account);
    if (student && classes) {
      return classes.find((c) => c.id === student.class) || null;
    }
    return null;
  }, [account, classes]);

  const teacherClasses: TeacherClassSubject[] | null = useMemo(() => {
    const teacher = asTeacher(account);
    if (!teacher) {
      return null;
    }
    return getTeacherClassSubjects(teacher, classes);
  }, [account, classes]);

  if (!account || !currentUser) {
    return null;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableRipple
        borderless
        style={styles.photoButton}
        onPress={changePhoto}
      >
        <>
          <UserAvatar
            photoURL={image || account.photoURL}
            name={account.name}
            size={144}
            loading={uploading}
          />
          {!uploading && (
            <MaterialCommunityIcons
              name="camera"
              size={24}
              color="#fff"
              style={[styles.editIcon, { backgroundColor: theme.colors.accent }]}
            />
          )}
        </>
      </TouchableRipple>

      <List.Section style={styles.detailsSection}>
        <List.Item
          title="Name"
          description={account.name}
          // eslint-disable-next-line react/jsx-props-no-spreading
          left={(props) => <List.Icon {...props} icon="account" />}
        />
        {currentUser.email && (
          <List.Item
            title="Email"
            description={currentUser.email}
            // eslint-disable-next-line react/jsx-props-no-spreading
            left={(props) => <List.Icon {...props} icon="at" />}
          />
        )}
        {currentUser.phoneNumber && (
          <List.Item
            title="Phone number"
            description={currentUser.phoneNumber}
            // eslint-disable-next-line react/jsx-props-no-spreading
            left={(props) => <List.Icon {...props} icon="phone" />}
          />
        )}
        <List.Item
          title="School"
          description={school ? school.name : '...'}
          // eslint-disable-next-line react/jsx-props-no-spreading
          left={(props) => <List.Icon {...props} icon="bank-outline" />}
        />
        {teacherClasses && (
          <List.Item
            title="Class/Subjects"
            description={teacherClasses.map(({ name, subject }) => (subject ? `${name}: ${subject}` : name)).join('\n')}
            // eslint-disable-next-line react/jsx-props-no-spreading
            left={(props) => <List.Icon {...props} icon="teach" />}
            descriptionNumberOfLines={100}
          />
        )}
        {studentClass && (
          <List.Item
            title="Class"
            description={studentClass.name}
            // eslint-disable-next-line react/jsx-props-no-spreading
            left={(props) => <List.Icon {...props} icon="teach" />}
          />
        )}
      </List.Section>
    </ScrollView>
  );
}

export default Profile;
